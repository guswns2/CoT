from flask import Flask, request
from datetime import datetime
import pymysql
from sqlalchemy import create_engine
pymysql.install_as_MySQLdb()
import requests as req
from bs4 import BeautifulSoup as bs
import pandas as pd
import datetime
from xgboost import XGBRegressor
import joblib
from tqdm import tqdm
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/today_weather', methods = ['GET', 'POST'])
def crawling2() :
     
    res=req.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%82%A0%EC%94%A8")
    soup=bs(res.text,'lxml')

    location = soup.select("#main_pack > section.sc_new.cs_weather_new._cs_weather > div._tab_flicking > div.top_wrap > div.title_area._area_panel > h2.title")
    to = soup.select("#main_pack > section.sc_new.cs_weather_new._cs_weather > div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info > div")
    to_weather = to[0].text.strip()
    to_loc = location[0].text.strip()

    response_body = {
        'data' : to_weather,
        'data1' : to_loc,
    }
    
    print(to_loc, to_weather)

    return  (response_body)
    

@app.route('/pre_weather', methods = ['GET', 'POST'])

def crawling() : 
    # freemeteo 에서 날씨 데이터 크롤링
    week = ['today', 'tomorrow', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']

    list_tm = []
    list_tp = []
    list_hm = []
    list_rn = []

    # 요일별
    for i in week : 
        res=req.get(f"https://freemeteo.kr/weather/kwangju/hourly-forecast/{i}/?gid=1841811&language=korean&country=south-korea")
        soup=bs(res.text,'lxml')
        weather=soup.select("#content > div.right-col > div.weather-now > div.today.table > div > table > tbody > tr> td:nth-child(2)")

        # 시간별
        for i in range(2,len(weather)) : 
            weather=soup.select(f"#content > div.right-col > div.weather-now > div.today.table > div > table > tbody > tr> td:nth-child({i})")

            temp = weather[len(weather)-6].text
            humi = weather[len(weather)-3].text
            rain = weather[len(weather)-1].text
            if rain == '\xa0':
                rain = '0mm'
            if temp == '\xa0':
                temp = '0°C'
            if humi == '\xa0':
                humi = '0%'

            time = soup.select(f"#content > div.right-col > div.weather-now > div.today.table > div > table > thead > tr > th:nth-of-type({i})")
            date = soup.select("#page-titles > h1")
            date = date[0].text[-11:].strip()+" "+time[0].text+":00"
            date = pd.to_datetime(date)
            if (time[0].text == '00:00') | (time[0].text == '03:00') : 
                date = date + datetime.timedelta(days=1)

            list_tm.append(date)
            list_tp.append(float(temp.replace('°C',"")))
            list_hm.append(float(humi.replace('%',"")))
            list_rn.append(float(rain.replace('mm',"")))

    # 가져온 데이터 데이터프레임으로 저장
    df_wt = pd.DataFrame(columns=['date_w','temp','humi','rain'])
    df_wt['date_w']=pd.Series(list_tm)
    df_wt['temp']=pd.Series(list_tp)
    df_wt['humi']=pd.Series(list_hm)
    df_wt['rain']=pd.Series(list_rn)
    df_wt = df_wt.set_index('date_w')
    
    # 3시간 단위 -> 1시간 단위로 변경 및 날씨데이터 보간
    df_rs = df_wt.resample(rule='H').last()
    df_ip = df_rs.interpolate()
    df_re = df_ip.reset_index()

    engine = create_engine("mysql+mysqldb://cot:sion1234@project-db-stu.ddns.net:3307/cot", encoding='utf-8')
    conn = engine.raw_connection()
    cursor = conn.cursor()
    
    df_re.to_sql(name='weather', con=engine, if_exists='append', index=False)

    # datetime 특성으로 쪼개기
    date = pd.to_datetime(df_re.date_w)
    df_re['hour'] = date.dt.hour
    df_re['day'] = date.dt.day
    df_re['month'] = date.dt.month
    df_re['weekday'] = date.dt.weekday   # 요일

    # 날짜 특성 object로 변환
    df_re.hour = df_re.hour.astype({'hour':'string'})
    df_re.day = df_re.day.astype({'day':'string'})
    df_re.month = df_re.month.astype({'month':'string'})
    df_re.weekday = df_re.weekday.astype({'weekday':'string'})

    df_re.hour = df_re.hour.astype({'hour':'object'})
    df_re.day = df_re.day.astype({'day':'object'})
    df_re.month = df_re.month.astype({'month':'object'})
    df_re.weekday = df_re.weekday.astype({'weekday':'object'})
    
    # hour 컬럼 값이 한 자리일 시 앞에 0 추가
    for i in tqdm(range(0, len(df_re))) : 
        if len(df_re['hour'][i]) == 1 : 
            df_re['hour'][i] = '0' + df_re['hour'][i]

    categorical_feature = ['hour', 'day', 'month', 'weekday']

    for feature_name in categorical_feature : 
        # 원-핫 인코딩
        one_hot = pd.get_dummies(df_re[feature_name],prefix=feature_name)
        # 기존 문자 형태 컬럼 삭제
        df_re.drop(feature_name, axis=1, inplace=True)
        # 기존 test 데이터에 원-핫 데이터 병합하기
        df_re = pd.concat([df_re,one_hot], axis=1)
    
    x_columns = ['temp', 'humi', 'rain', 'hour_00', 'hour_01', 'hour_02', 'hour_03',
       'hour_04', 'hour_05', 'hour_06', 'hour_07', 'hour_08', 'hour_09',
       'hour_10', 'hour_11', 'hour_12', 'hour_13', 'hour_14', 'hour_15',
       'hour_16', 'hour_17', 'hour_18', 'hour_19', 'hour_20', 'hour_21',
       'hour_22', 'hour_23', 'day_1', 'day_10', 'day_11', 'day_12', 'day_13',
       'day_14', 'day_15', 'day_16', 'day_17', 'day_18', 'day_19', 'day_2',
       'day_20', 'day_21', 'day_22', 'day_23', 'day_24', 'day_25', 'day_26',
       'day_27', 'day_28', 'day_29', 'day_3', 'day_30', 'day_31', 'day_4',
       'day_5', 'day_6', 'day_7', 'day_8', 'day_9', 'month_1', 'month_10',
       'month_11', 'month_12', 'month_2', 'month_3', 'month_4', 'month_5',
       'month_6', 'month_7', 'month_8', 'month_9', 'weekday_0', 'weekday_1',
       'weekday_2', 'weekday_3', 'weekday_4', 'weekday_5', 'weekday_6']

    list1 = list(set(x_columns)-set(df_re.columns))
    for i in list1 :
        df_re[i]=0
    
    y_df_re = df_re['date_w']
    x_df_re = df_re.iloc[:,1:][x_columns]
    
    # 예측
    xgb_load = joblib.load("./xgb_reg.pkl")
    pred = xgb_load.predict(x_df_re)

    predict = pd.DataFrame(pred, columns=['pre_power'])
    predict['pre_carbon'] = pred*0.4594
    predict['pre_id'] = request.args.get('id')
    predict1 = pd.concat([y_df_re,predict], axis=1, ignore_index=True)
    predict2 = predict1[[3,0,1,2]]
    predict2.columns = ['pre_id', 'pre_time', 'pre_power', 'pre_carbon']

    print('진짜 들어간다!')
    print(predict2)

    # DB로 데이터프레임 전송
    predict2.to_sql(name='predict', con=engine, if_exists='append', index=False)
    sql = "delete from predict where num in (select ext_id from (select min(num) ext_id from predict group by pre_id, pre_time having count(*)>1) tmp);"
    engine.execute(sql)
    conn.close() 


    return "1"


if __name__ == '__main__':
    # 서버 실행
    app.run(port='5000' ,debug = True)
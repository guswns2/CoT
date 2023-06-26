import { colors, TextField } from "@mui/material";
import "./css/SecondSection.css";
import PieChart from "./Chart/PieChart";
import BarChartWeek from "./Chart/BarChartWeek";
import BarChartYear from "./Chart/BarChartYear";
import BarChartMonth from "./Chart/BarChartMonth";
import LineChart from "./Chart/LineChart";
import { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import Header from "./Header";

const SecondSection = () => {
  const [choice, setChoice] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const [maxpm, setmaxpm] = useState("");
  const [minpm, setminpm] = useState("");
  const [maxcm, setmaxcm] = useState("");
  const [mincm, setmincm] = useState("");

  const [maxpy, setmaxpy] = useState("");
  const [minpy, setminpy] = useState("");
  const [maxcy, setmaxcy] = useState("");
  const [mincy, setmincy] = useState("");

  let i = localStorage.getItem("date")!=null?String(localStorage.getItem("date")):"";

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("e.target.value", e.target.value);
    localStorage.setItem("date", e.target.value);
    setChoice(e.target.value);
    
  };
  useEffect(() => {
    document.getElementById("main").style.borderBottom = "";
    document.getElementById("dashboard").style.borderBottom = "1px solid white";
  }, []);

  // 리포트로 데이터 전송
  const reportImg = () => {
    axios
      .post("http://127.0.0.1:3001/ReportData", {
        weekPower: localStorage.getItem("weekPower").split(","),
        weekCarborn: localStorage.getItem("weekCarborn").split(","),
        weeklabels: localStorage.getItem("weeklabels").split(","),
        monthPower: localStorage.getItem("monthPower").split(","),
        monthCarborn: localStorage.getItem("monthCarborn").split(","),
        monthlabels: localStorage.getItem("monthlabels").split(","),
        yearPower: localStorage.getItem("yearPower").split(","),
        yearCarborn: localStorage.getItem("yearCarborn").split(","),
        yearlabels: localStorage.getItem("yearlabels").split(","),
        selectdate: i
      })
      .then((result) => {
        console.log(result.data.result);
        // if (result.data.resuit == 11){
          window.open(
            "http://172.30.1.29:8075/webroot/decision/view/form?viewlet=%25EB%258C%2580%25EC%258B%259C%25EB%25B3%25B4%25EB%2593%259C%25EC%259D%25B4%25EB%25AF%25B8%25EC%25A7%2580.frm&op=form_adaptive"
          );
        // }

      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("데이터 보내기 실패!");
      });
  }

    const reportPdf = () => {
      axios
        .post("http://127.0.0.1:3001/ReportData", {
          weekPower: localStorage.getItem("weekPower").split(","),
          weekCarborn: localStorage.getItem("weekCarborn").split(","),
          weeklabels: localStorage.getItem("weeklabels").split(","),
          monthPower: localStorage.getItem("monthPower").split(","),
          monthCarborn: localStorage.getItem("monthCarborn").split(","),
          monthlabels: localStorage.getItem("monthlabels").split(","),
          yearPower: localStorage.getItem("yearPower").split(","),
          yearCarborn: localStorage.getItem("yearCarborn").split(","),
          yearlabels: localStorage.getItem("yearlabels").split(","),
          selectdate: i
          
        })
        .then((result) => {
          console.log(result.data.result);
          window.open(
            "http://172.30.1.29:8075/webroot/decision/view/report?viewlet=%25EB%258C%2580%25EC%258B%259C%25EB%25B3%25B4%25EB%2593%259C%25EB%258D%25B0%25EC%259D%25B4%25ED%2584%25B0.cpt");
            
          }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
        .catch(() => {
          console.log("데이터 보내기 실패!");
        });
    };

  return (
    <>
    <Header></Header>
    <section className="second-section" id="Second Section">
      <div className="second-container1" id="Second Container1">
        <div className="second-info1" id="Second Info1">
          <div>
            <div className="info1-box11" id="Info1 Box1">
              <TextField
                className="selectdate"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                size="medium"
                color="primary"
                fullWidth={true}
                onChange={handleSubmit}
              />
            </div>
            <b className="selectedDay">선택 날짜 : {i}</b>
          </div>
          <div className="info1-box21" id="Info1 Box">
              <button className="pdfbutton" onClick={()=>{reportPdf();}}><img style={{width:'100%', height:'100%'}} src="download-pdf.png"></img></button>
              <button className="imgbutton" onClick={()=>{reportImg();}}><img style={{width:'100%', height:'100%'}} src="download-img.png"></img></button>
          </div>
        </div>
      </div>
      <div className="second-container2" id="Second Container2">
        <div className="second-info2-1" id="Second Info2">
          <div className="info2-box1" id="info2 Box1">
            <b className="b">주간 전력소비량 / 탄소배출량</b>
          </div>
          <div className="info2-box2" id="info2 Box2">
            <div className="bar">
              {/* {click === true && <BarChartWeek></BarChartWeek>} */}
              <BarChartWeek
                val={choice}
                val2={setA}
                val3={setB}
                val4={setC}
                val5={setD}
              ></BarChartWeek>
            </div>
          </div>
        </div>
        <div className="second-info2-2" id="Second Info3">
          <div className="info2-box1" id="info3 Box1">
            <b className="b">요약</b>
          </div>
          <div className="monthcard">
            <div className="powercard">
              <b className="powertext">주간 전력 소비량 </b>
              <br></br>
              <b className="ctext">최대 {a=="-Infinity"? 0 : a}</b>
              <br></br>
              <b className="ctext">최소 {b=="Infinity"? 0 : b}</b>
            </div>
            <div className="carborncard">
              <b className="carborntext">주간 탄소 배출량 </b>
              <br></br>
              <b className="ctext">최대 {c=="-Infinity"? 0 : c}</b>
              <br></br>
              <b className="ctext">최소 {d=="Infinity"? 0 : d}</b>
            </div>
          </div>
        </div>
      </div>
      <div className="second-container2" id="Second Container2">
        <div className="second-info2-1" id="Second Info2">
          <div className="info2-box1" id="info2 Box1">
            <b className="b">월간 전력소비량 / 탄소배출량</b>
          </div>
          <div className="info2-box2" id="info2 Box2">
            <div className="bar">
              <BarChartMonth
                val={choice}
                val6={setmaxpm}
                val7={setminpm}
                val8={setmaxcm}
                val9={setmincm}
              ></BarChartMonth>
            </div>
          </div>
        </div>
        <div className="second-info2-2" id="Second Info3">
          <div className="info2-box1" id="info3 Box1">
            <b className="b">요약</b>
          </div>
          <div className="monthcard">
            <div className="powercard">
              <b className="powertext">월간 전력 소비량 </b>
              <br></br>
              <b className="ctext"> 최대 {maxpm=="-Infinity"? 0 : maxpm}</b>
              <br></br>
              <b className="ctext"> 최소 {minpm=="Infinity"? 0 : minpm}</b>
            </div>
            <div className="carborncard">
              <b className="carborntext">월간 탄소 배출량 </b>
              <br></br>
              <b className="ctext">최대 {maxcm=="-Infinity"? 0 : maxcm}</b>
              <br></br>
              <b className="ctext">최소 {mincm=="Infinity"? 0 : mincm}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="second-container2" id="Second Container2">
        <div className="second-info2-1" id="Second Info2">
          <div className="info2-box1" id="info2 Box1">
            <b className="b">연간 전력소비량 / 탄소배출량</b>
          </div>
          <div className="info2-box2" id="info2 Box2">
            <div className="bar">
              <BarChartYear

                val={choice}
                val10={setmaxpy}
                val11={setminpy}
                val12={setmaxcy}
                val13={setmincy}
              ></BarChartYear>
            </div>
          </div>
        </div>
        <div className="second-info2-2" id="Second Info3">
          <div className="info2-box1" id="info3 Box1">
            <b className="b">요약</b>
          </div>
          <div className="monthcard">
            <div className="powercard">
              <b className="powertext">연간 전력 소비량 </b>
              <br></br>
              <b className="ctext">최대 {maxpy=="-Infinity"? 0 : maxpy}</b>
              <br></br>
              <b className="ctext">최소 {minpy=="Infinity"? 0 : minpy}</b>
            </div>
            <div className="carborncard">
              <b className="carborntext">연간 탄소 배출량 </b>
              <br></br>
              <b className="ctext">최대 {maxcy=="-Infinity"? 0 : maxcy}</b>
              <br></br>
              <b className="ctext">최소 {mincy=="Infinity"? 0 : mincy}</b>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default SecondSection;

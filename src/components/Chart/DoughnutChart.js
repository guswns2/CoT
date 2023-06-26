import { useEffect, useState } from 'react';
import {Chart as ChartJs, Tooltip, Title, ArcElement, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJs.register(
  Tooltip, Title, ArcElement, Legend
);

 const DoughnutChart = () =>{
 
  const [totalEmission, setTotalEmission] = useState(0);
  const [accEmission, setAccEmission] = useState(0);
  const [spareEmission, setSpareEmission] = useState(0);
  let co2 = String(parseInt(localStorage.getItem("co2"))).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  let co2Int = localStorage.getItem('co2');
  
  let data = {
      labels: ["누적 배출량", "여유 배출량"],
      datasets: [
        {
          type: "doughnut",
          data: [accEmission, spareEmission],
          backgroundColor: ["pink", "lightgray"],
          // hoverBackgroundColor:["green","red"], // 호버링 색 정하기
          cutout: "80%", //도넛 내부 직경 크기 변경
          datalabels: {
            color: ["gray", "#d18592"],
            backgroundColor: ["rgb(255, 192, 203)", "rgb(211, 211, 211)"],
            borderRadius: 13,
            font: { size: 17, weight: "bold", border: "1px" },
          },
        },
      ],
    };
    
    let options = {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom",
          labels:{
            color:'white'
          }
        },
        title: {
          display: false,
          text: "title",
        },
        datalabels: {
          display:true,
          formatter:(context, args) => {
            const index = args.dataIndex;
            return (parseFloat((context/totalEmission)*100)+"").slice(0,4)+"%";
          },
        },
        },
      };
      
      //도넛차트 가운데에 글씨넣는 속성 plugins
    let textCenter = {
      id: 'textCenter',
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {ctx, data} = chart;
        const xCoor = chart.getDatasetMeta(0).data[0].x;
        const yCoor = chart.getDatasetMeta(0).data[0].y;
        const num = Object.values(data)[1][0].data[0];
        let num1 = String(num).split(".",2);

        // 아래 구문을 넣으면 숫자를 3칸씩 ,로 구분해줌        
        let num2 = num1[0].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        ctx.save();

        //누적 사용 배출권
        ctx.font = 'bolder 13px sans-serif';
        ctx.fillStyle = "#eba1ad";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("누적 배출량", xCoor-40, yCoor - 55);

        ctx.font = "bolder 25px sans-serif";
        ctx.fillStyle = "#eba1ad";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(num2, xCoor, yCoor - 30);

        ctx.font = "bolder 10px sans-serif";
        ctx.fillStyle = "#eba1ad";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("(tco2)", xCoor+46, yCoor - 10);
        
        //배출권 총량
        ctx.font = "bolder 13px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("연 할당배출권 총량", xCoor - 40, yCoor + 15);

        ctx.font = "bolder 25px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(co2, xCoor, yCoor + 40)

        ctx.font = "bolder 10px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("(tco2)", xCoor + 46, yCoor + 60);
      }
    }

      useEffect(() => {
         axios
          .post("http://127.0.0.1:3001/Emission", {
            ID:localStorage.getItem('id')
          })
          .then((result) => {
            console.log("Emission", result.data.accemission);
            setAccEmission(result.data.accemission);
            setTotalEmission(co2Int);
            setSpareEmission(co2Int - result.data.accemission);
            
          }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
          .catch(() => {
            console.log("데이터 보내기 실패!");
          });
      }, []);

  return (
    <>
      <Doughnut
        data={data}
        options={options}
        plugins={[textCenter,ChartDataLabels]}
        style={{ display: "inline-block",
                  marginTop:"10%" 
                }}
        width={"330px"}
        height={"330px"}
      />
      
    </>
  );
}

export default DoughnutChart;
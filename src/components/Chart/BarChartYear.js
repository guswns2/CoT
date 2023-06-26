import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
}from 'chart.js'
import { useState, useEffect } from "react";
import axios from "axios";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

function BarChartYear (props){

  const [yearPower, setYearPower] = useState([]);
  const [yearCarborn, setYearCarborn] = useState([]);
  // const [preData, setPreData] = useState([]);

  const [labels, setLabels] = useState([]);
  
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "전력사용량",
        data: yearPower,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 2,
      },

      // 이중 그래프에 써먹을 것.
      {
        label: "탄소배출량",
        data: yearCarborn,
        backgroundColor: "#A5FB7E",
        borderColor: "#A5FB7E",
        tension: 0,
        type: "line",
        order: 0,
        borderWidth: 3,
      },
    ],
  };

const options = {
  reponsive: true,
  maintainAspectRatio: false,
  type: "bar",
  data: data,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: "white",
      },
      beginAtZero: true,
      grid: {
        color: "#3F3F3F",
      },
    },
    x: {
      ticks: {
        color: "white",
      },
      grid: {
        color: "#3F3F3F",
      },
    },
  },
};

  useEffect(() => {

    // 월간 전력소비량
    axios
      .post("http://127.0.0.1:3001/ChartYear", {
        // SecondSection.js 로부터 props형식으로 받은 날짜값을 전달
        datevalue: localStorage.getItem('date'),
        ID:localStorage.getItem('id')
      })
      .then((result) => {
        // 받는 부분
        console.log("result.data.chartyearpower", result.data.chartyearpower);
        console.log("result.data.chartyearcarborn",result.data.chartyearcarborn);
        console.log("라벨 받는 부분", result.data.labels);
        setYearPower(result.data.chartyearpower);
        setYearCarborn(result.data.chartyearcarborn);
        let labelsArr = [];
        for (let i = 0; i < 12; i++){
          if(i+1 < 10){
            labelsArr.push(result.data.labels +"0"+(i + 1) + "월");  
          }else{
            labelsArr.push(result.data.labels + (i + 1) + "월");
          }
        }
        setLabels(labelsArr);
      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("데이터 보내기 실패!");
      });
  }, [props.val]);

    useEffect(() => {
      let val10 = String(Math.max.apply(null, yearPower)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val11 = String(Math.min.apply(null, yearPower)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val12 = String(Math.max.apply(null, yearCarborn)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val13 = String(Math.min.apply(null, yearCarborn)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      props.val10(val10);
      props.val11(val11);
      props.val12(val12);
      props.val13(val13);

      localStorage.setItem("yearPower", yearPower);
      localStorage.setItem("yearCarborn", yearCarborn);
      localStorage.setItem("yearlabels",labels);
    }, [labels]);
  
    return(
        <>
            <Bar
            data={data}
            options={options}
            ></Bar>
        </>
    )
}

export default BarChartYear;
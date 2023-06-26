import { Bar } from "react-chartjs-2";
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

function BarChartMonth (props){

  const [monthPower, setmonthPower] = useState([]);
  const [monthCarborn, setmonthCarborn] = useState([]);
  const [preData, setPreData] = useState([]);
  const [labels, setLabels] = useState([]);
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "전력사용량",
        data: monthPower,
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

      // 이중 그래프에 써먹을 것. Line 그래프
      {
        label : '탄소배출량',
        data: monthCarborn,
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
      labels:{
        color:'white'
      }
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

    // 주간 전력소비량
    axios
      .post("http://127.0.0.1:3001/ChartMonth", {
        // SecondSection.js 로부터 props형식으로 받은 날짜값을 전달
        datevalue: localStorage.getItem('date'),
        ID:localStorage.getItem('id')
      })
      .then((result) => {
        // 받는 부분
       console.log("chartmonthpower", result.data.chartmonthpower);
       console.log("chartmonthcarborn", result.data.chartmonthcarborn);
       console.log("라벨 받는 부분", result.data.labels);
       setmonthPower(result.data.chartmonthpower);
       setLabels(result.data.labels);
       setmonthCarborn(result.data.chartmonthcarborn);
      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("데이터 보내기 실패!");
      });
  }, [props.val]);
  
    useEffect(() => {
      let val6 = String(Math.max.apply(null, monthPower)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val7 = String(Math.min.apply(null, monthPower)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val8 = String(Math.max.apply(null, monthCarborn)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      let val9 = String(Math.min.apply(null, monthCarborn)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      props.val6(val6);
      props.val7(val7);
      props.val8(val8);
      props.val9(val9);

      localStorage.setItem("monthPower", monthPower);
      localStorage.setItem("monthCarborn", monthCarborn);
      localStorage.setItem("monthlabels", labels);
    }, [labels]);
    
    return(
        <>
            <Bar
            data={data}
            options = {options}
            ></Bar>
        </>
    )
}

export default BarChartMonth;
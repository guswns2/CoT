import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChartNweek() {
  const [weekPower, setWeekPower] = useState([]);
  const [weekCarborn, setWeekCarborn] = useState([]);
  const [weekPre, setWeekPre] = useState([]);
  const [labels, setLabels] = useState([]);

  const data = {
    labels: [
      labels[0] + " 월",
      labels[1] + " 화",
      labels[2] + " 수",
      labels[3] + " 목",
      labels[4] + " 금",
      labels[5] + " 토",
      labels[6] + " 일",
    ],

    datasets: [
      {
        label: "주간 전력사용량",
        data: weekPower,
        backgroundColor: ["rgba(252,252,42,0.3)"],
        borderColor: ["rgb(255, 205, 86)"],
        borderWidth: 2,
      },

      {
        label: "주간 탄소배출량",
        data: weekCarborn,
        backgroundColor: "white",
        borderColor: "white",
        tension: 0,
        type: "line",
        order: 0,
        borderWidth: 3,
      },
      {
        label: "주간 예상 전력사용량",
        data: weekPre,
        backgroundColor: "pink",
        borderColor: "pink",
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
        labels: {
          color: "white",
        },
        display: true,
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
    // 시간대별 전력소비량/탄소배출량
    axios
      .post("http://127.0.0.1:3001/ChartNWeek", {
        ID:localStorage.getItem('id')
      })
      .then((result) => {
        // 받는 부분
        console.log(result);
        console.log("chartweekpower", result.data.chartweekpower);
        console.log("chartweekcarborn", result.data.chartweekcarborn);
        console.log("chartweekpre", result.data.chartweekpre);
        console.log("라벨 받는 부분", result.data.labels);
        setWeekPower(result.data.chartweekpower);
        setLabels(result.data.labels);
        setWeekCarborn(result.data.chartweekcarborn);
        setWeekPre(result.data.chartweekpre);
      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("chartnow 데이터 보내기 실패!");
      });
  }, []);

  return (
    <>
      <Bar data={data} options={options}></Bar>
    </>
  );
}

export default BarChartNweek;

import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)


export default function LineChart(){
  // X축
  const labels = ["2018","2019","2020","2021"];
  
  const data = {
    labels,
    datasets: [
      {
        label: '온실가스 배출량',
        data: [7148,3563,775,1620,674,632,510,402,2785],
        borderColor: 'blue',
        backgroundColor: 'blue',
        
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display:true,
        position : 'top',
        align :"right",
      },
    },
    scales:{
        x:{
            grid:{
                display:true,
            },
            },
        y:{
            grid:{
                display: true,
            },
        },
    }
  };

    return(
        <>           
          <Line
          data={data}
          options = {options}  
            />
        </>
    );
}

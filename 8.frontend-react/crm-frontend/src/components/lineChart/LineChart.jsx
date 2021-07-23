import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import './lineChart.scss';
import ColorsHelper from '../../helpers/colorsHelper';

function LineChart(props){
  const colors = new ColorsHelper();
  const [data, setData] = useState({labels: [], datasets:[]});

  useEffect(()=>{
    if(props.data){
      const datasets = [];
      let index = 0;
      for(let item in props.data.datasets){
        const color = colors.getColor(index);
        datasets.push({
          label: item,
            data: props.data.datasets[item],
            fill: false,
            backgroundColor: color.color,
            borderColor: color.border,
            borderWidth: 1
        })
        index++;
      }
      const tempData = {
        labels: props.data.labels,
        datasets: datasets
      }
      setData(tempData);
    }
  }, [props.data]);


    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };

    return (
        <div className='line-chart-container chart-view'>
            <div className='header'>
            <h3 className='title'>{props.title}</h3>
            </div>
            <Line data={data} options={options} />
        </div>
    );
}
export default LineChart;
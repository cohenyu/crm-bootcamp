import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './groupedBar.scss'
import ColorsHelper from '../../helpers/colorsHelper';

function GroupedBar(props) {
const [data, setData] = useState({});
const colors = new ColorsHelper();
  useEffect(()=>{
    if(props.data.datasets){
      const tempData = {
        labels: props.data.labels,
        datasets: props.data.datasets.map((set, index)=>{
          return {
            label: set.label,
            data: set.data,
            backgroundColor: colors.getColor(index).color,
            borderColor: colors.getColor(index).border,
            borderWidth: 1,
          }
        })
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
      <div className='bar-chart-container'> 
        <div className='header'>
            <h3 className='title'>{props.title}</h3>
        </div>
        <Bar data={data} options={options} />
    </div>
  );
}

export default GroupedBar;
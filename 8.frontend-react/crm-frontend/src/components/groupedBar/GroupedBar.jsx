import React from 'react';
import { Bar } from 'react-chartjs-2';
import './groupedBar.scss'

const data = {
  labels: ['1', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: '# of Red Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: '# of Blue Votes',
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor:  'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

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

function GroupedBar(props) {

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
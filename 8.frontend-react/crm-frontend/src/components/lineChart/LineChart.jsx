import React from 'react';
import { Line } from 'react-chartjs-2';
import './lineChart.scss'

function LineChart(props){

    const data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: '# of bla',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            backgroundColor: 'rgba(153, 102, 255)',
            borderColor: 'rgba(153, 102, 255, 0.2)',
          },
          {
            label: '# of Vd',
            data: [10, 4, 1, 7, 8, 16],
            fill: false,
            backgroundColor: 'rgba(255, 206, 86)',
            borderColor: 'rgba(255, 206, 86, 0.2)',
          },
          {
            label: '# of Votes',
            data: [15, 11, 2, 1, 14, 10],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: '# of fdg',
            data: [12, 17, 10, 4, 6, 1],
            fill: false,
            backgroundColor: 'rgba(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: '# of th',
            data: [2, 13, 4, 8, 17, 18],
            fill: false,
            backgroundColor: 'rgba(255, 159, 64)',
            borderColor:  'rgba(255, 159, 64, 0.2)',
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

    return (
        <div className='line-chart-container'>
            <div className='header'>
            <h3 className='title'>{props.title}</h3>
            </div>
            <Line data={data} options={options} />
        </div>
    );
}
export default LineChart;
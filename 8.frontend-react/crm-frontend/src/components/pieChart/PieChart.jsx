import React, {useEffect, useState} from 'react';
import { Pie } from 'react-chartjs-2';
import './pieChart.scss';



function PieChart(props){
    const [data, setData] = useState({labels: [], datasets:[]});
    useEffect(()=>{
        if(props.data.labels){
            const tempData = {
                labels: props.data.labels,
                datasets: [
                    {
                        label: "",
                        data: props.data.values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                          ],
                          borderWidth: 1,
                    }
                ]
            }
            setData(tempData);
        }
    }, [props.data]);


    return (
        <div className='pie-chart-container chart-view'>
            <div className='header'>
                <h3 className='title'>{props.title}</h3>
            </div>
            <Pie className='pie' data={data} />
        </div>
    );
}

export default PieChart;

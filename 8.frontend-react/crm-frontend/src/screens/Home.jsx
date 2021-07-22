import React, {useEffect, useState} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import GroupedBar from '../components/groupedBar/GroupedBar';
import LineChart from '../components/lineChart/LineChart';
import PieChart from '../components/pieChart/PieChart';
import CrmApi from '../helpers/CrmApi';
import DatePicker from '../components/datePicker/DatePicker';

function Home(props) {
    const [costChartData, setCostChartData] = useState({});
    const [statusChartData, setStatusChartData] = useState({});
    const [maxWorkingHours, setMaxWorkingHours] = useState({});
    const [minWorkingHours, setMinWorkingHours] = useState({});
    const crmApi = new CrmApi();
    const [dateStatus, setDateStatus] = useState("week");
    const [dateCost, setDateCost] = useState("week");
    const [dateMinWorking, setMinWorkingDate] = useState("month");
    const [dateMaxWorking, setMaxWorkingDate] = useState("month");

    useEffect(()=>{
        
        (async () => {
          const result = await crmApi.postRequest('/dashboard/projectCostVsEstimated/', {interval: dateCost, limit: 5});
          if(result){
              const labels = [];
              const estimated = {label: 'Estimated Cost', data: []};
              const actual = {label: 'Actual cost', data: []};
              for(let item of result){
                  labels.push(item.user_name);
                  estimated.data.push(item.estimated_cost);
                  actual.data.push(item.total_cost);
              }
              setCostChartData({labels: labels, datasets: [estimated, actual]})
          }
        })();


        (async () => {
            const result = await crmApi.postRequest('/dashboard/getProjectStatusSum/', {interval: dateStatus});
            if(result){
                const labels = [];
                const data = [];
                for(let item of result){
                    labels.push(item.project_status);
                    data.push(item.count)
                }
                setStatusChartData({labels: labels, values: data})
            }
          })();

          (async () => {
            const result = await crmApi.postRequest('/dashboard/workingHours/', {interval: dateMaxWorking, mode: 'max', limit: 2});
            if(result){
                const preparedData = prepareLineChartData(result);
                setMaxWorkingHours(preparedData);
            }
          })();

          (async () => {
            const result = await crmApi.postRequest('/dashboard/workingHours/', {interval: dateMinWorking, mode: 'min', limit: 2});
            if(result){
                const preparedData = prepareLineChartData(result);
                setMinWorkingHours(preparedData);
            }
          })();


    }, []);

    const prepareLineChartData = (result) => {
        const labelsX = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const datasets = {};
        for(let item of result){
            if(!datasets[item.user_name]){
                datasets[item.user_name] = Array(7).fill(0);
            } 
            datasets[item.user_name][parseInt(item.day_in_week) - 1] = parseInt(item.work_time);
        }
       
        return {labels: labelsX, datasets: datasets};
    }

    const handleChangeDate = (date, setFunction) => {
        setFunction(date);
    }

    return (
        <div className='page-container'>
            <Header/>
            <div className='crm-page'>
            <PageTitle className='page-title' title='Dashboard'/>
            <div className='charts'>
                <div className='chart'>
                    <DatePicker handleClick={(date)=>{handleChangeDate(date, setMaxWorkingDate)}} current={dateMaxWorking} buttons={["week", "month", "year"]}/>
                    <LineChart data={maxWorkingHours} title='Max Working Hours'/>
                </div>
                <div className='chart' >
                    <DatePicker handleClick={(date)=>{handleChangeDate(date, setMinWorkingDate)}} current={dateMinWorking} buttons={["week", "month", "year"]}/>
                    <LineChart data={minWorkingHours} title='Min Working Hours'/>
                </div>
                <div className='chart' >
                    <DatePicker handleClick={(date)=>{handleChangeDate(date, setDateCost)}} current={dateCost} buttons={["day", "week", "month"]}/>
                    <GroupedBar data={costChartData} title='Estimated VS Actual Project Average Cost'/>
                </div>
                <div className='chart'>
                     <DatePicker handleClick={(date)=>{handleChangeDate(date, setDateStatus)}} current={dateStatus} buttons={["day","week", "month"]}/>
                    <PieChart data={statusChartData} title='Project status'/>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Home;
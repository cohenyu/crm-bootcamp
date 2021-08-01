import React, {useEffect, useState} from 'react';
import Header from '../components/header/Header';
import PageTitle from '../components/pageTitle/PageTitle';
import '../styles/crmPage.css'
import GroupedBar from '../components/groupedBar/GroupedBar';
import LineChart from '../components/lineChart/LineChart';
import PieChart from '../components/pieChart/PieChart';
import CrmApi from '../helpers/CrmApi';
import DatePicker from '../components/datePicker/DatePicker';
import MiniProjectsList from '../components/miniProjectsList/MiniProjectsList';

function Home(props) {
    const [costChartData, setCostChartData] = useState({});
    const [statusChartData, setStatusChartData] = useState({});
    const [maxWorkingHours, setMaxWorkingHours] = useState({});
    const [minWorkingHours, setMinWorkingHours] = useState({});
    const [leastRecentlyCreatedProjects, setLeastRecentlyCreatedProjects] = useState([]);
    const crmApi = new CrmApi();
    const [dateStatus, setDateStatus] = useState("week");
    const [dateCost, setDateCost] = useState("week");
    const [dateMinWorking, setMinWorkingDate] = useState("month");
    const [dateMaxWorking, setMaxWorkingDate] = useState("month");
    const [dateLeastRecentlyCreatedProject, setDateLeastRecentlyCreatedProject] = useState("month");


    /**
     * Fetches the average estimated cost and the total cost of the projects in the date range per user. 
     */
    const fetchCost = () => {
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
    } 

    /**
     * Fetches the cost at the first time and then sets an interval to make this happen every 20 seconds 
     */
    useEffect(()=>{
        fetchCost();
        const interval =  setInterval(fetchCost, 20 * 1000);
        return () => clearInterval(interval);
    }, [dateCost])


     /**
     * Fetches the sum of each project status in the date range per user. 
     */
    const fetchStatus = () => {
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
    }

    /**
     * Fetches the status at the first time and then sets an interval to make this happen every 20 seconds 
     */
    useEffect(()=>{
        fetchStatus();
        const interval =  setInterval(fetchStatus, 20 * 1000);
        return () => clearInterval(interval);
    }, [dateStatus]);


    /**
     * Fetches the 4 users who have the most working hours
     */
    const FetchMaxWorking = () => {
        (async () => {
            const result = await crmApi.postRequest('/dashboard/workingHours/', {interval: dateMaxWorking, mode: 'max', limit: 4});
            if(result){
                const preparedData = prepareLineChartData(result);
                setMaxWorkingHours(preparedData);
            }
          })();
    }

    /**
     * Fetches the working hours and then sets an interval to make this happen every 20 seconds 
     */
    useEffect(()=>{
        FetchMaxWorking();
        const interval =  setInterval(FetchMaxWorking, 20 * 1000);
        return () => clearInterval(interval);
    }, [dateMaxWorking]);


    /**
     * Fetches the 4 users who have the least working hours
     */
    const fetchMinWorking = () => {
        (async () => {
            const result = await crmApi.postRequest('/dashboard/workingHours/', {interval: dateMinWorking, mode: 'min', limit: 4});
            if(result){
                const preparedData = prepareLineChartData(result);
                setMinWorkingHours(preparedData);
            }
          })();
    }

    /**
     * Fetches the working hours and then sets an interval to make this happen every 20 seconds 
     */
    useEffect(()=>{
        fetchMinWorking();
        const interval =  setInterval(fetchMinWorking, 20 * 1000);
        return () => clearInterval(interval);
    }, [dateMinWorking]);


    /**
     * Fetches the 5 projects that were created the longest time ago.
     */
    const fetchLeastRecentlyProjects = () => {
        (async () => {
            const result = await crmApi.postRequest('/dashboard/leastRecentlyCreatedProject/', {interval: dateLeastRecentlyCreatedProject, limit: 5});
            if(result){
                setLeastRecentlyCreatedProjects(result);
            }
          })();
    }

    /**
     * Fetches the project and then sets an interval to make this happen every 20 seconds 
     */
    useEffect(()=>{
        fetchLeastRecentlyProjects();
        const interval =  setInterval(fetchLeastRecentlyProjects, 20 * 1000);
        return () => clearInterval(interval);
    }, [dateLeastRecentlyCreatedProject]);
   
          


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
                    <DatePicker 
                        handleClick={(date)=>{handleChangeDate(date, setDateLeastRecentlyCreatedProject)}} 
                        current={dateLeastRecentlyCreatedProject} 
                        buttons={["day","week", "month"]}
                    />
                    <MiniProjectsList 
                        title='Least Recently Created Projects' 
                        projectsList={leastRecentlyCreatedProjects}
                    />
                </div>
                <div className='chart'>
                     <DatePicker 
                        handleClick={(date)=>{handleChangeDate(date, setDateStatus)}} 
                        current={dateStatus} 
                        buttons={["day","week", "month"]}
                     />
                    <PieChart 
                        data={statusChartData} 
                        title='Project status'
                    />
                </div>
                <div className='chart'>
                    <DatePicker 
                        handleClick={(date)=>{handleChangeDate(date, setMaxWorkingDate)}} 
                        current={dateMaxWorking} 
                        buttons={["week", "month", "year"]}
                    />
                    <LineChart 
                        data={maxWorkingHours} 
                        title='Max Working Hours'
                    />
                </div>
                <div className='chart' >
                    <DatePicker 
                        handleClick={(date)=>{handleChangeDate(date, setMinWorkingDate)}} 
                        current={dateMinWorking} 
                        buttons={["week", "month", "year"]}
                    />
                    <LineChart 
                        data={minWorkingHours} 
                        title='Min Working Hours'
                    />
                </div>
                <div className='chart' >
                    <DatePicker 
                        handleClick={(date)=>{handleChangeDate(date, setDateCost)}} 
                        current={dateCost} 
                        buttons={["day", "week", "month"]}
                    />
                    <GroupedBar 
                        data={costChartData} 
                        title='Estimated VS Actual Project Average Cost'
                    />
                </div>
            </div>
            </div>
        </div>
    );
}

export default Home;
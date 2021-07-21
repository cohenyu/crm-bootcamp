import React,{ useState, useRef, useEffect } from 'react';
import CrmButton from '../crmButton/CrmButton';
import './timer.scss'

const Timer = (props) => {
    const [timer, setTimer] = useState(0);
    const increment = useRef(null);

    function getDifferenceInSeconds(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / 1000;
    }

    function fromSqlToDate(date){
      var t = date.split(/[- :]/);
      return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])); 
    }
    useEffect(()=>{
        console.log("starting time ",props.startingTime);
        if(props.run){
            if(props.startingTime){
              const now = new Date();
              const startingTime = fromSqlToDate(props.startingTime);            
                setTimer(Math.round(getDifferenceInSeconds(startingTime, now)));
            }
            handleStart();
        } else {
            handleReset();
        }

        return () => {clearInterval(increment.current)}
    }, [props.run, props.startingTime]);
  
    const handleStart = () => {
      increment.current = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
  
    const handleReset = () => {
      clearInterval(increment.current)
      setTimer(0)
    }
  
    const formatTime = () => {
      const getSeconds = `0${(timer % 60)}`.slice(-2)
      const minutes = `${Math.floor(timer / 60)}`
      const getMinutes = `0${minutes % 60}`.slice(-2)
      const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
      return `${getHours} : ${getMinutes} : ${getSeconds}`
    }
    

    return (
      <div className='timer'>
          {formatTime()}
      </div>
    );
  }

export default Timer;
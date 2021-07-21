import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

function CrmCalendar(props) {

    const localizer = momentLocalizer(moment)
    const myEventsList = [
    {
        title: "title",
        start: new Date("28 May 2021 09:00:00 +0000"), 
        end: new Date("28 May 2021 10:00:00 +0000")
    },
    {
        title: "bla",
        start: new Date("28 May 2021 09:00:00 +0000"), 
        end: new Date("28 May 2021 10:00:00 +0000")
    },
    {
        title: "lala",
        start: new Date("28 May 2021 0:00:00 +0000"), 
        end: new Date("28 May 2021 0:00:00 +0000")
    },
];
    return (
        <div>
            <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{height: "150vh"}}
            />
        </div>
    );
}

export default CrmCalendar;
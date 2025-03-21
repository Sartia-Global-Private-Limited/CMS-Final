import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import React from 'react'

const HolidayCalender = () => {
    const events = [
        { title: 'Meeting', start: new Date() }
    ]

    function renderEventContent(eventInfo) {
        return (
            <div className='social-btn w-100 h-auto success-combo'>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        )
    }
    return (
        <FullCalendar plugins={[dayGridPlugin]} initialView='dayGridMonth' weekends={true} events={events} eventContent={renderEventContent} />
    )
}

export default HolidayCalender
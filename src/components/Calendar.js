import React, { useState, useRef } from 'react';
import Modal from './Modal';
import './Calendar.css';

const Calendar = ({ attendanceData, timetable }) => {
  const [date, setDate] = useState(new Date());
  const calendarRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = firstDayOfMonth.getDay();

  const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDate(new Date(year, month + 1, 1));

  const getDayData = (day) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const record = attendanceData.find(r => r.date === dateStr);
    let status = record ? record.type.toLowerCase() : '';
    let holidayName = record && record.type === 'Holiday' && record.holidayName ? record.holidayName : null;
    return {
      status,
      holidayName,
      record,
    };
  };

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const { status, holidayName, record } = getDayData(day);
    const weekDay = new Date(year, month, day).getDay();
    const dayName = daysOfWeek[weekDay];
    const periods = timetable && timetable[dayName] ? timetable[dayName] : [];
    calendarDays.push(
      <div key={day} className={`calendar-day ${status} ${status === 'holiday' ? 'holiday-special' : ''}`}> 
        <span className="day-number">{day}</span>
        {status === 'holiday' && (
          <span className="day-status holiday-label">{(record && record.holidayName) ? record.holidayName : 'Holiday'}</span>
        )}
        {status === 'full day' && (
          <span className="day-status full-label">Full Day</span>
        )}
        {status === 'half day' && (
          <span className="day-status half-label">Half Day</span>
        )}
        {status !== 'holiday' && periods.length > 0 && (
          <div className="periods-list">
            {periods.map((p, idx) => (
              <div key={idx} className="period-item">
                <span className="period-time">{p.time}</span>
                <span className="period-subject">{p.subject}</span>
                <span className="period-teacher">{p.teacher}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container" ref={calendarRef}>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => <div key={day} className="calendar-day-name">{day}</div>)}
        {calendarDays}
      </div>
    </div>
  );
};

export default Calendar; 
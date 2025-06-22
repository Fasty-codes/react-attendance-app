import React, { useState, useRef } from 'react';
import Modal from './Modal';
import './Calendar.css';

const Calendar = ({ attendanceData, events, onAddEvent }) => {
  const [date, setDate] = useState(new Date());
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventText, setEventText] = useState('');
  const [popover, setPopover] = useState({ show: false, content: [], x: 0, y: 0 });
  const calendarRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = firstDayOfMonth.getDay();

  const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (eventText.trim() && selectedDay) {
      const eventDate = new Date(year, month, selectedDay).toISOString().split('T')[0];
      onAddEvent({ date: eventDate, text: eventText });
      setEventModalOpen(false);
      setEventText('');
    }
  };

  const handleEventMouseEnter = (e, dayEvents) => {
    const rect = e.target.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();
    setPopover({
      show: true,
      content: dayEvents.map(event => event.title), // Assuming events have a 'title' property
      x: rect.left - calendarRect.left + rect.width / 2,
      y: rect.top - calendarRect.top - 10,
    });
  };

  const handleEventMouseLeave = () => {
    setPopover({ show: false, content: [], x: 0, y: 0 });
  };

  const getDayData = (day) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const record = attendanceData.find(r => r.date === dateStr);
    const dayEvents = events.filter(e => e.date === dateStr);
    return {
      status: record ? record.type.toLowerCase() : '',
      events: dayEvents,
    };
  };

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const { status, events: dayEvents } = getDayData(day);
    calendarDays.push(
      <div key={day} className={`calendar-day ${status}`} onClick={() => handleDayClick(day)}>
        <span className="day-number">{day}</span>
        {status && <span className="day-status">{status.replace(/_/g, ' ')}</span>}
        {dayEvents.length > 0 && (
          <div 
            className="events-list" 
            onMouseEnter={(e) => handleEventMouseEnter(e, dayEvents)}
            onMouseLeave={handleEventMouseLeave}
            onTouchStart={(e) => handleEventMouseEnter(e, dayEvents)} // Basic touch support
            onTouchEnd={handleEventMouseLeave}
          >
            {dayEvents.map(event => <div key={event.id} className="event-dot"></div>)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container" ref={calendarRef}>
      {popover.show && (
        <div className="event-popover" style={{ top: popover.y, left: popover.x }}>
          <ul>
            {popover.content.map((text, index) => <li key={index}>{text}</li>)}
          </ul>
        </div>
      )}
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => <div key={day} className="calendar-day-name">{day}</div>)}
        {calendarDays}
      </div>
      <Modal isOpen={isEventModalOpen} onClose={() => setEventModalOpen(false)}>
        <div className="event-modal">
          <h3>Add Event for {selectedDay && new Date(year, month, selectedDay).toLocaleDateString()}</h3>
          <textarea
            placeholder="Event details..."
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
          />
          <button onClick={handleSaveEvent}>Save Event</button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar; 
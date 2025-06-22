import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './TimetablePage.css';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetablePage = () => {
  const { user } = useContext(AuthContext);
  const classes = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];

  const getPeriodsForDay = (day) => {
    let periods = [];
    classes.forEach(c => {
      if (c.timetable && c.timetable[day]) {
        c.timetable[day].forEach(p => {
          periods.push({ ...p, className: c.name });
        });
      }
    });
    return periods.sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="timetable-page-container">
      <h1>My Weekly Timetable</h1>
      <p>This is a combined view of the timetables for all your classes.</p>
      <div className="info-box">
        <i className='bx bx-info-circle'></i>
        To edit the timetable for a specific class, please go to the Dashboard, select a class, and navigate to the 'Timetable' tab.
      </div>
      <div className="weekly-view">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            <div className="periods-list">
              {getPeriodsForDay(day).length > 0 ? (
                getPeriodsForDay(day).map((period, index) => (
                  <div key={index} className="period-card">
                    <span className="period-time">{period.time}</span>
                    <span className="period-name">{period.name}</span>
                    <span className="period-class-name">{period.className}</span>
                  </div>
                ))
              ) : (
                <p className="no-periods">No periods scheduled.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage; 
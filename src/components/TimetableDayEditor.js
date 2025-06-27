import React, { useState, useEffect } from 'react';
import './TimetableDayEditor.css';

const TimetableDayEditor = ({ day, periods, onUpdate, onAddPeriod, onRemovePeriod }) => {
  const [dayPeriods, setDayPeriods] = useState(periods);

  useEffect(() => {
    setDayPeriods(periods);
  }, [periods]);

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...dayPeriods];
    updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
    setDayPeriods(updatedPeriods);
    onUpdate(day, updatedPeriods);
  };

  const addPeriod = () => {
    if (dayPeriods.length < 10) {
      onAddPeriod(day);
    }
  };

  const removePeriod = (index) => {
    onRemovePeriod(day, index);
  };

  return (
    <div className="day-editor-container">
      <h3>Editing Timetable for {day}</h3>
      <div className="periods-table-wrapper">
        <table className="periods-edit-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dayPeriods.map((period, index) => (
              <tr key={index}>
                <td>{period.period}</td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={period.subject || ''}
                    onChange={(e) => handlePeriodChange(index, 'subject', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g., Mr. Smith"
                    value={period.teacher || ''}
                    onChange={(e) => handlePeriodChange(index, 'teacher', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g., 9:00 - 10:00 AM"
                    value={period.time || ''}
                    onChange={(e) => handlePeriodChange(index, 'time', e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => removePeriod(index)} className="remove-period-btn" title="Remove Period">
                    <i className='bx bxs-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dayPeriods.length < 10 && (
          <button onClick={addPeriod} className="add-period-btn">
            <i className='bx bx-plus-circle'></i> Add New Period
          </button>
        )}
      </div>
    </div>
  );
};

export default TimetableDayEditor; 
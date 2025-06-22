import React, { useState, useEffect } from 'react';
import './TimetableEditor.css';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableEditor = ({ initialTimetable, onSave }) => {
  const [timetable, setTimetable] = useState(initialTimetable || {});
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // If the initial timetable changes, update the state
    setTimetable(initialTimetable || {});
  }, [initialTimetable]);

  const handleAddPeriod = () => {
    const dayTimetable = timetable[selectedDay] || [];
    if (dayTimetable.length >= 10) {
      alert("You can only add up to 10 periods per day.");
      return;
    }
    const newTimetable = { ...timetable };
    newTimetable[selectedDay] = [...dayTimetable, { name: 'New Period', time: '09:00' }];
    setTimetable(newTimetable);
  };

  const handleUpdatePeriod = (day, index, field, value) => {
    const updatedTimetable = { ...timetable };
    updatedTimetable[day][index][field] = value;
    setTimetable(updatedTimetable);
  };
  
  const handleRemovePeriod = (day, index) => {
    const updatedTimetable = { ...timetable };
    updatedTimetable[day].splice(index, 1);
    setTimetable(updatedTimetable);
  };

  const handleSaveTimetable = () => {
    onSave(timetable);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide message after 2 seconds
  };

  return (
    <div className="timetable-container">
      <div className="day-selector">
        {daysOfWeek.map(day => (
          <button 
            key={day} 
            className={`day-btn ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="timetable-editor">
        <h2>{selectedDay}</h2>
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Period Name</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(timetable[selectedDay] || []).map((period, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="text" 
                    value={period.name}
                    onChange={(e) => handleUpdatePeriod(selectedDay, index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input 
                    type="time" 
                    value={period.time}
                    onChange={(e) => handleUpdatePeriod(selectedDay, index, 'time', e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleRemovePeriod(selectedDay, index)} className="remove-period-btn">
                    <i className='bx bxs-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="timetable-actions">
          <button onClick={handleAddPeriod} className="add-period-btn">
            <i className='bx bx-plus'></i> Add Period
          </button>
          <div className="save-container">
            <button onClick={handleSaveTimetable} className="save-timetable-btn">
              <i className='bx bx-save'></i> Save Timetable
            </button>
            {isSaved && <span className="saved-message">Saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor; 
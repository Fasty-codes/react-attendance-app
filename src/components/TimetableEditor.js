import React, { useState, useEffect } from 'react';
import './TimetableEditor.css';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const TimetableEditor = ({
  timetable,
  onSave,
  readOnly = false,
  activeDay: parentActiveDay,
  setActiveDay: parentSetActiveDay
}) => {
  // Use parent state if provided, else local
  const [activeDay, setActiveDay] = parentActiveDay && parentSetActiveDay
    ? [parentActiveDay, parentSetActiveDay]
    : useState(daysOfWeek[0]);
  const [localTimetable, setLocalTimetable] = useState({ ...timetable });

  useEffect(() => {
    setLocalTimetable({ ...timetable });
  }, [timetable]);

  const handlePeriodChange = (index, field, value) => {
    if (readOnly) return;
    const updatedPeriods = [...(localTimetable[activeDay] || [])];
    updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
    setLocalTimetable({
      ...localTimetable,
      [activeDay]: updatedPeriods,
    });
  };

  const handleAddPeriod = () => {
    if (readOnly) return;
    const updatedPeriods = [...(localTimetable[activeDay] || [])];
    updatedPeriods.push({ period: updatedPeriods.length + 1, name: '', time: '' });
    setLocalTimetable({
      ...localTimetable,
      [activeDay]: updatedPeriods,
    });
  };

  const handleRemovePeriod = (index) => {
    if (readOnly) return;
    const updatedPeriods = [...(localTimetable[activeDay] || [])];
    updatedPeriods.splice(index, 1);
    setLocalTimetable({
      ...localTimetable,
      [activeDay]: updatedPeriods,
    });
  };

  const handleSave = () => {
    if (readOnly) return;
    onSave(localTimetable);
  };

  return (
    <div className="timetable-editor-page">
      {/* Days as tabs */}
      <div className="timetable-day-tabs">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`day-tab${activeDay === day ? ' active' : ''}`}
            onClick={() => setActiveDay(day)}
            type="button"
          >
            {day}
          </button>
        ))}
      </div>
      <div className="timetable-editor-content">
        <h2 className="timetable-day-label">{activeDay}</h2>
        <table className="timetable-editor-table">
          <thead>
            <tr>
              <th>Period Name</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(localTimetable[activeDay] || []).map((period, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    value={period.name || ''}
                    placeholder="Period Name"
                    onChange={e => handlePeriodChange(idx, 'name', e.target.value)}
                    disabled={readOnly}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={period.time || ''}
                    placeholder="Time"
                    onChange={e => handlePeriodChange(idx, 'time', e.target.value)}
                    disabled={readOnly}
                  />
                </td>
                <td>
                  <button className="remove-period-btn" onClick={() => handleRemovePeriod(idx)} title="Remove Period" disabled={readOnly}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="timetable-editor-actions">
          {!readOnly && <button className="add-period-btn" onClick={handleAddPeriod}>+ Add Period</button>}
          {!readOnly && <button className="save-timetable-btn" onClick={handleSave}>💾 Save Timetable</button>}
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor; 
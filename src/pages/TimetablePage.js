import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimetableEditor from '../components/TimetableEditor';
import './TimetablePage.css';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const TimetablePage = () => {
    const { classId } = useParams();
    const [timetable, setTimetable] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [classes, setClasses] = useState([]);
    const [activeDay, setActiveDay] = useState(daysOfWeek[0]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        setClasses(storedClasses);
        const currentClass = storedClasses.find(c => c.id === classId);
        if (currentClass && currentClass.timetable) {
            setTimetable(currentClass.timetable);
        } else if (currentClass) {
            // Initialize with empty timetable if not present
            const newTimetable = generateEmptyTimetable();
            setTimetable(newTimetable);
        } else {
            setTimetable(null);
        }
    }, [classId]);

    const generateEmptyTimetable = () => {
        const days = daysOfWeek;
        const timetable = {};
        days.forEach(day => {
            timetable[day] = [];
        });
        return timetable;
    };

    const handleSaveTimetable = (newTimetable) => {
        const updatedClasses = classes.map(c => {
            if (c.id === classId) {
                return { ...c, timetable: newTimetable };
            }
            return c;
        });
        localStorage.setItem('classes', JSON.stringify(updatedClasses));
        setClasses(updatedClasses);
        setTimetable(newTimetable);
        setIsEditing(false);
    };

    const currentClass = classes.find(c => c.id === classId);

    // DEBUG: Always show this message to confirm render
    return (
        <div className="timetable-page">
            <div style={{background: 'yellow', color: 'black', padding: 10, fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>
                DEBUG: TimetablePage is rendering!
            </div>
            {!classId && (
                <div style={{ color: 'red', padding: 30 }}>No class selected. Please select a class first.</div>
            )}
            {(!classes || classes.length === 0) && (
                <div style={{ color: 'red', padding: 30 }}>No classes found. Please create a class first.</div>
            )}
            {!currentClass && classId && classes.length > 0 && (
                <div style={{ color: 'red', padding: 30 }}>Class not found. Please check your class selection.</div>
            )}
            {!timetable && classId && currentClass && (
                <div>Loading timetable...</div>
            )}
            {classId && currentClass && timetable && (
                <>
                    <div className="timetable-header">
                        <h1>Timetable for {currentClass?.name}</h1>
                        <button onClick={() => setIsEditing(true)} className="edit-timetable-btn">Edit Timetable</button>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, padding: 12, minHeight: 300 }}>
                        <TimetableEditor
                            timetable={timetable}
                            onSave={handleSaveTimetable}
                            readOnly={!isEditing}
                            activeDay={activeDay}
                            setActiveDay={setActiveDay}
                        />
                    </div>
                    <button onClick={() => navigate(`/class/${classId}`)} className="back-to-class-btn">Back to Class</button>
                </>
            )}
        </div>
    );
};

export default TimetablePage; 
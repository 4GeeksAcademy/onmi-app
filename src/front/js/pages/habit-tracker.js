import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../styles/habit-tracker.css";

export const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (title && category) {
            const newHabit = { title, category, count: 0, dates: [] };
            setHabits([...habits, newHabit]);
            setTitle("");
            setCategory("");
        }
    };

    const handleIncrement = (index) => {
        const newHabits = [...habits];
        newHabits[index].count += 1;
        newHabits[index].dates.push(new Date());
        setHabits(newHabits);
    };

    const handleDelete = (index) => {
        const newHabits = habits.filter((_, i) => i !== index);
        setHabits(newHabits);
    };

    return (
        <div className="habit-tracker-container habit-tracker">
            <main>
                <h1>Habit - Tracker</h1>
                <form className="habit-form" onSubmit={handleAddHabit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                    <button type="submit">Add a new habit</button>
                </form>
                <div className="habit-list">
                    {habits.map((habit, index) => (
                        <div key={index} className="habit-item">
                            <h3>{habit.title}</h3>
                            <p>Category: {habit.category}</p>
                            <p>Status: <span className="status-count">{habit.count}</span></p>
                            <Calendar
                                value={selectedDate}
                                tileClassName={({ date, view }) => {
                                    if (habit.dates.find(d => d.toDateString() === date.toDateString())) {
                                        return 'highlight';
                                    }
                                }}
                                tileContent={({ date, view }) => {
                                    if (habit.dates.find(d => d.toDateString() === date.toDateString())) {
                                        return <div className="dot"></div>;
                                    }
                                }}
                            />
                            <button onClick={() => handleIncrement(index)}>Increment</button>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HabitTracker;
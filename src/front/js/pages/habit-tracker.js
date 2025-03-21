import React, { useState,useContext,useEffect } from "react";
import { Context } from "../store/appContext";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../styles/habit-tracker.css";

export const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const {store, actions}=useContext(Context);

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (title && category) {
            actions.PostHabits(title, category)
            const newHabit = { title, category, count: 0, dates: [] };
            setHabits([...habits, newHabit]);
            setTitle("");
            setCategory("");
        }
    };

    const handleIncrement = (index) => {
        const newHabits = [...store.habitTracker];
        newHabits[index].count += 1;
        newHabits[index].dates.push(new Date());
    
        // Actualiza el estado local
        setHabits(newHabits);
    
        // Llama a la acción para actualizar el hábito en el backend
        actions.UpdateHabit(habit.id, {
            count: habit.count,
            dates: habit.dates
        });
    };

    useEffect(()=>{
        actions.getHabits()
    },[])
    console.log(store.habitTracker)
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
                    {store.habitTracker.length>0?store.habitTracker.map((habit, index) => (
                        <div key={index} className="habit-item">
                            <h3>{habit.name}</h3>
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
                            <button onClick={() => actions.DeleteHabits(habit.id)}>Eliminar</button>
                        </div>
                    )):null}
                </div>
            </main>
        </div>
    );
};

export default HabitTracker;
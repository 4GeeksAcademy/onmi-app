import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { CardHabit } from "../component/newHabit";


export const Habits = () => {

    return (

        <div className="container h-100">
            <button type="button" onClick={CardHabit} className="btn btn-secondary">New Habit</button>
        </div>

    )
}
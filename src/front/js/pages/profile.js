import React, { useContext, useState, useEffect} from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";
import { Link } from "react-router-dom";
import logo from "../../img/logo-sin-fondo.jpg"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pomodoro } from "../component/pomodoro";
import pomodoro_exp from "../../img/pomodoro_exp.png"
import { Avatars } from "../component/avatars";

const emotionsMap = {
  happy: "😄",
  love: "🥰",
  neutral: "😐",
  mad: "😡",
  sad: "😭",
};

  console.log(Object.entries(emotionsMap));

export const Profile = () => {
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedEmotion, setSelectedEmotion] = useState("neutral");
  const { store, actions } = useContext(Context);

  
  const userGender = localStorage.getItem("gender") || "prefer_not_to_say";

  console.log("Género actual del usuario:", store.userGender);
  console.log("Prop gender pasada al Avatar:", store.userGender);


  useEffect(() => {
    actions.getGender();
}, []);

console.log("Género actual en el store:", store.userGender);


  return (
    <div className="parent container "> 

      <div className="calendar">
        <div className="title ">
          <h1 className='text-center'>Calendar</h1>
        </div>
        <div className='calendar-container pr-3'>
          <Calendar onChange={setDate} value={date} />

          <p className='text-center mt-3'>
            <span className='bold'>Selected Date:</span>{' '}
            {date.toDateString()}
          </p>
        </div>
      </div>
      <div className="container mt-5 " id="middle" style={{ justifyContent: "center", alignItems: 'center', textAlign: "center" }}>
        <h1> <b>How are you feeling today?</b></h1>

        <Avatars gender={store.userGender} emotion={selectedEmotion} setEmotion={setSelectedEmotion} />
        


{/* 
        <div className="btn-group mt-3" role="group" aria-label="Basic radio toggle button group">

          {Object.entries(emotionsMap).map(([emotion, emoji]) => (

        <React.Fragment key={emotion}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id={emotion}
                autoComplete="off"
                onChange={() => setSelectedEmotion(emotion)}
              />

                <label
                className={`btn ${selectedEmotion === emotion ? "btn-primary" : "btn-outline-primary"}`}
                htmlFor={emotion}
              >
                {emoji}
              </label>
            </React.Fragment>
))}
 </div> */}
          {/* <input type="radio" className="btn-check" name="btnradio" id="bien" autoComplete="off" onChange={() => setSelected("bien")} />
          <label className={`btn ${selected === "bien" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="bien">😄 </label>

          <input type="radio" className="btn-check" name="btnradio" id="enamorado" autoComplete="off" onChange={() => setSelected("enamorado")} />
          <label className={`btn ${selected === "enamorado" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="enamorado">🥰</label>

          <input type="radio" className="btn-check" name="btnradio" id="regular" autoComplete="off" onChange={() => setSelected("regular")} />
          <label className={`btn ${selected === "regular" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="regular">😑</label>

        
          <input type="radio" className="btn-check" name="btnradio" id="enfadado" autoComplete="off" onChange={() => setSelected("enfadado")} />
          <label className={`btn ${selected === "enfadado" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="enfadado">😡</label>

          <input type="radio" className="btn-check" name="btnradio" id="triste" autoComplete="off" onChange={() => setSelected("triste")} />
          <label className={`btn ${selected === "triste" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="triste">😭</label> */}
       


        <div className="container mt-5 mb-5" >
          <button> Check my progress </button>
        </div>

      </div>



      <div className="pomodoro container">
      
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#explanation" >
❓
</button>
<br></br>
<div className="modal fade" id="explanation" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">What's Pomodoro Technique?</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <img className= "pomodoro_exp" src={pomodoro_exp} alt="pomodoro_exp" />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Understood</button>
       
      </div>
    </div>
  </div>
</div>
        {/* <!-- Button trigger modal --> */}
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          Pomodoro Timer
          ⏱︎
        </button>

        {/* <!-- Modal --> */}
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Pomodoro Timer</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Pomodoro />
              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                {/* <button type="button" className="btn btn-primary">Understood</button> */}
              </div>
            </div>
          </div>
        </div>
      
        





      </div>


    </div>
  )

}
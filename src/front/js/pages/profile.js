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
import { EmotionCounter } from "../component/emotionCounter";

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

  // console.log("Género actual del usuario:", store.userGender);
  // console.log("Prop gender pasada al Avatar:", store.userGender);


  useEffect(() => {
    actions.getGender();
}, []);

// useEffect(() => {
//   const userEmail = localStorage.getItem("userEmail");
//   if (userEmail) {
//       actions.emotionFromLocalStorage(); // Cargar datos de emociones específicos para este email
//   } else {
//       console.log("No hay un usuario autenticado.");
//   }
// }, []);

useEffect(() => {
  const loadUserData = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        console.log(`Cargando datos para: ${email}`);
        await actions.emotionFromLocalStorage(); // Corregido el llamado
      } else {
        console.error("No se encontró el email al cargar datos.");
      }
    };

    loadUserData();
  }, []);


console.log("Género actual en el store:", store.userGender);
console.log("Email guardado:", localStorage.getItem("userEmail"));


  return (
    <div className="parent container" style={{ position: "relative", justifyContent: "center", alignItems: 'center', textAlign: "center" }}> 

      <div className="calendar">
        <div className="title ">
          <h1 className='text-start'>My Calendar</h1>
        </div>
        <div className='calendar-container '>
          <Calendar onChange={setDate} value={date} />

          <p className='text-center mt-3'>
            <span className='bold'>Selected Date:</span>{' '}
            {date.toDateString()}
          </p>
        </div>
      </div>
      <div className="container mt-5 " id="middle" style={{ position: "relative", justifyContent: "center", alignItems: 'center', textAlign: "center" }}>
        <h1> <b>How are you feeling today?</b></h1>

        {/* <Avatars gender={store.userGender} emotion={selectedEmotion} setEmotion={setSelectedEmotion} /> */}
        <Avatars
            gender={store.userGender}
            emotion={store.emotions.currentEmotion} // Ahora viene del store
            setEmotion={actions.setEmotion} // Llamamos directamente a la acción
          />

        
        <EmotionCounter emotions={store.emotions.count}/>
        
      </div>

        {/* //explicación y pomodoro */}

      <div className="pomodoro container">
      
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#explanation" >
❓
</button>
<br></br>
<div className="modal fade" id="explanation" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
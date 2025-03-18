import React, { useState,useEffect } from "react";


export const Avatars = ({ gender }) => {
  const [emotion, setEmotion] = useState("neutral");

  // ✅ Ruta ajustada para encontrar las imágenes correctamente
  const getAvatarImg = () => {
   
    const baseURL = process.env.BACKEND_URL  || "http://localhost:3001";
    const validGender = gender || "prefer_not_to_say";
    return `${baseURL}/img/a.${validGender}_${emotion}.gif`;
    

};
  
  
useEffect(() => {
  console.log("Cambio en el género o emoción:", gender, emotion);
}, [gender, emotion]);

  return (
    <div className="avatar-container">
      {/* <h2>My Avatar</h2> */}

      {/* ✅ Manejo de errores mejorado para cargar imagen alternativa */}
      <img
        src={getAvatarImg()}
        alt="Avatar"
        className="avatar-image"
      // onError={(e) => {
      //   console.error("Error cargando la imagen:", e.target.src);
      //   e.target.src = "/img/a.prefer_not_to_say_neutral.gif";
      // }}
      />

      {/* <img src="/img/a.female_neutral.gif" alt="Test Avatar" /> */}


      {/* ✅ Botones para cambiar emoción */}
      <div className="btn-group mt-3" role="group" aria-label="Basic radio toggle button group">
        {["happy", "love", "neutral", "mad", "sad"].map((em) => (
          <button
            key={em}
            type="radio"
           
            name="btnradio"
            className={`btn ${emotion === em ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setEmotion(em)}
          >
            {em === "happy"
              ? "😄"
              : em === "love"
                ? "🥰"
                : em === "neutral"
                  ? "😐"
                  : em === "mad"
                    ? "😡"
                    : "😭"}
          </button>
        ))}
      </div>
    </div>
  );
};
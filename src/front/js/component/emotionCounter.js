import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const EmotionCounter = ({ emotion }) => {

  const {emotions} = useContext(Context).store;


  return (
    <div className="emotions-counter">
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Check my progress
   </button>
   <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div className="modal-dialog modal-dialog-centered">
       <div className="modal-content">
         <div className="modal-header">
           <h1 className="modal-title fs-5" id="exampleModalLabel">How many times have you been...</h1>
           <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div className="modal-body text-start">
         <h2>😄 Happy:{emotions.counts.happy}</h2>
         <h2>🥰 Lovely:{emotions.counts.love}</h2>
         <h2>😐 Neutral:{emotions.counts.neutral}</h2>
         <h2>😡 Mad:{emotions.counts.mad}</h2>
         <h2>😭 Sad:{emotions.counts.sad}</h2>
         </div>
         <div className="modal-footer justify-content-center">
           <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
         
         </div>
       </div>
     </div>
   </div>
   </div>
  );
}
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";

export const Loginview = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { store, actions } = useContext(Context);
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault()
    //console.log(email, password);

    let logged = await actions.login(email, password)
    
    
    if (logged === false) {
      alert("email or password wrong")
    }else{
      navigate("/profile")
    }
  }
//cambiar HTMLFOR en login y register error de console
  return (

    <div className="container-fluid mx-auto d-flex marginlogintop justify-content-center">
      <div className="card border border-0 marginloginright" style={{ width: "18rem" }}>
        <img src="https://i.postimg.cc/pd5s9QTf/Sin-t-tulo.jpg" alt="..." />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="d-flex justify-content-center mb-4 fs-1 textcolors">Welcome Back!</div>
          <div className="d-flex justify-content-center mb-4">Login below or&nbsp;<a href="forgot password"> create an account</a>
          </div>
          <label htmlFor="exampleInputEmail1" className="form-label ">Email address</label>
          <input type="email" className="form-control bordercolor border border-3" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control bordercolor border border-3" id="exampleInputPassword1" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <button type="submit" className="backbutton  w-100 border border rounded p-1 mb-1">Sign in</button>
        <Link to={"/resetpassword/"} className="d-flex justify-content-center mt-2">
          Have you forgotten your password?
        </Link>
      </form >
    </div >
  );
}
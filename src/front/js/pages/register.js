import React, { useState, useContext} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'


export const Register = () => {
  const { store, actions } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  
const navigate = useNavigate();
const [passwordError, setPasswordError] = useState(""); // estado error pw 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

     if (name==="password") {
       if (!validatePassword(value)) 
        {setPasswordError("Password must contain at least 8 characters and a Number."); } 
     else {
      setPasswordError("");
     }
     }
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add signup logic here
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords are not matching",
        customClass: {
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm-button",
        },
      });
      return;
    }
  // Validar la fortaleza de la contraseña
  if (!validatePassword(formData.password)) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password must contain at least 8 characters and a Number.",
        customClass: {
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm-button",
        },
    });
    return;
}
    const userCreated = await actions.register(formData.name, formData.email, formData.gender, formData.password );

    if (!userCreated) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cannot create user!",
        footer: '<a href="#">Double check the inputs please...</a>',
        customClass: {
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm-button",
        },
      });
    } else {
      Swal.fire({
        title: "User created!",
        text: "Welcome to ONMi!",
        icon: "success",
        customClass: {
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm-button",
        },
      });
      navigate("/profile");
    }
  };

   const validatePassword = (password) => {
     const minLength= 8;
     const hasNumber= /\d/; //se usa como exp para los num
  
     return password.length >= minLength && hasNumber.test(password);

 };

  console.log('Signup data:', formData);


  return (
    <div className="mx-auto my-5">
      <div className="container justify-center justify-between  align-center">
        {/* Left Side - Description */}
        <div className="">
          <h1 className="">Become a member</h1>
          <p className="">
            ONMi helps you organize your ideas, tasks, and projects simply and efficiently. 
            <br></br>
            <br></br>
            <b>Start today!</b>
            
          </p>
        </div>
        {/* Right Side - Signup Form */}
        <div className="ml-5 w-1/2 p-8 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6FEB]"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6FEB]"
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6FEB]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn mx-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} 
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6FEB]"
                required
              />
            </div>
            <div className="mb-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#D0D7DE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6FEB]"
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
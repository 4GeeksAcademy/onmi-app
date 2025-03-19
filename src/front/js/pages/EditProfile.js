import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext"; // Importamos el contexto
import "../../styles/editprofile.css";
import { DeletAccount } from "../component/ModalDeletAccount";

export const EditProfile = () => {
    const { store, actions } = useContext(Context); // Acceder al contexto global
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [gender, setGender] = useState("");


    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Asegúrate de que las contraseñas estén definidas
        if (!currentPassword || !newPassword) {
            alert("Por favor ingrese la contraseña actual y la nueva.");
            return;
        }

        // Llama a la función passwordChange con las contraseñas ingresadas
        await actions.passwordChange(currentPassword, newPassword);
    };


    // Cargar el perfil del usuario cuando se monte el componente
    useEffect(() => {
        actions.getProfile(); // Llamamos a la función para obtener el perfil
    }, []);

    // Actualizar el estado local cuando los datos del usuario cambien
    useEffect(() => {
        if (store.user) {
            setName(store.user.name || "");
            setEmail(store.user.email || "");
            setGender(store.user.gender || "");
        }
    }, [store.user]); // Se ejecuta cuando store.user cambia

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Profile saved", { name, email, currentPassword, newPassword, gender });
    };

    return (
        <div className="edit-profile-container">
            <main>
                <h1>Edit - Profile</h1>
                <form className="edit-profile-form" onSubmit={handleSave}>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled // Deshabilita el campo, no puede ser editado
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            disabled // El campo de email está completamente deshabilitado
                        />
                    </label>
                    <label>
                        Current Password
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </label>
                    <label>
                        New Password
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </label>
                    <button onClick={handlePasswordChange} type="submit">Save</button>
                </form>
                <div><DeletAccount /></div>
            </main>
            <div className="avatar-section">
                <div className="avatar-container">
                    <img src="path/to/avatar.png" alt="Avatar" />
                    <button>Change Avatar</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

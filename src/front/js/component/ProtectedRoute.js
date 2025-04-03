import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const userRole = localStorage.getItem("userRole");

    // Redirigir al usuario si no tiene el rol necesario
    if (userRole !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children; // Renderizar el contenido si tiene permisos
};

export default ProtectedRoute;

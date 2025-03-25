import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext"
import { Link } from "react-router-dom";
import "../../styles/projects.css";
import { Store } from "lucide-react";
// import { deleteProjects } from "../component/deleteProjets";



const Projects = () => {
    const [newProject, setNewProject] = useState({
        name: "",
        urgency: "low",
        dueDate: "",
        category: "",
        status: "In progress"
    });

    const { store, actions } = useContext(Context)

    // Usamos useEffect para llamar a GetProjects cuando el componente se monte
    useEffect(() => {
        actions.GetProjects(); // Actualiza el estado de projects con los proyectos del backend
    }, []); // Solo se ejecuta una vez cuando el componente se monta
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    console.log(store.projects);

    return (
        <div className="projects-container">
            <h1 className="projects-title">Projects</h1>
            <div className="projects-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={handleChange}
                />
                <select name="urgency" value={newProject.urgency} onChange={handleChange}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <input
                    type="date"
                    name="dueDate"
                    value={newProject.dueDate}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newProject.category}
                    onChange={handleChange}
                />
                <select name="status" value={newProject.status} onChange={handleChange}>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <button onClick={() => actions.PostProjects(newProject.name, newProject.urgency, newProject.category, newProject.status, newProject.dueDate)} className="projects-button">Crear Nuevo</button>
            </div>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Urgency</th>
                        <th>Due Date</th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {store.projects.length > 0 ? (
                        store.projects.map((project) => (
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.name}</td>
                                <td>
                                    <span className={`projects-urgency-${project.Urgency ? project.Urgency.toLowerCase() : "unknown"}`}>
                                        {project.Urgency}
                                    </span>
                                </td>
                                <td>{project.date || "No date"}</td>
                                <td>{project.category}</td>
                                <td>
                                    <span className={`projects-status-${project.status.toLowerCase().replace(" ", "-")}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td>
                                    <button className = "border border rounded btn btn-danger " onClick={() => actions.deleteProjects(project.id)}><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No projects found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link to="/profile" className="projects-button">Perfil</Link>
        </div >
    );
};

export default Projects;

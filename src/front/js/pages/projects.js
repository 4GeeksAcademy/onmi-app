import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/projects.css";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        name: "",
        urgency: "Low",
        dueDate: "",
        category: "",
        status: "In progress"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const addProject = () => {
        const projectToAdd = {
            ...newProject,
            id: projects.length + 1
        };
        setProjects([...projects, projectToAdd]);
        setNewProject({
            name: "",
            urgency: "Low",
            dueDate: "",
            category: "",
            status: "In progress"
        });
    };

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
                <button onClick={addProject} className="projects-button">Crear Nuevo</button>
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
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td><span className={`projects-urgency-${project.urgency.toLowerCase()}`}>{project.urgency}</span></td>
                            <td>{project.dueDate}</td>
                            <td>{project.category}</td>
                            <td><span className={`projects-status-${project.status.toLowerCase().replace(" ", "-")}`}>{project.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/profile" className="projects-button">Perfil</Link>
        </div>
    );
};

export default Projects;
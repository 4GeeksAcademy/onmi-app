import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Thememode } from "./Thememode"
import logo from "../../img/logo-sin-fondo.jpg"


export const Cardnote = (props) => {
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [category, setCategory] = useState(props.category);
    const { store, actions } = useContext(Context);
    //const note = store.notes
    console.log(props.id);

    async function handleSubmit(e) {
        e.preventDefault();

        // Llamar a la acción para actualizar la nota
        const success = await actions.updateNote(props.id, title, description, category);

        actions.updateNoteInStore(store.updatedNote);

        if (success) {
            console.log("Note updated successfully in the store!");
            alert("Note updated successfully!");
            window.location.reload();
        } else {
            console.error("Failed to update the note.");
            alert("Failed to update the note.");
        }
    };



    const handleDeleteNote = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (confirmed) {
            const success = await actions.deleteNote(id);
            if (success) {
                console.log(`Note with ID ${id} deleted successfully`);
                window.location.reload();
            } else {
                alert("Error deleting the note");
            }
        }

    };

    return (
        <div className="col">
            <div className="card">
                <div className="card-body d-flex flex-column mb-3">

                    <div className="container d-flex justify-content-between">
                        <h5 className="card-title">{props.title}</h5>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target={`#modalEditNote${props.id}`}>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>

                    </div>
                    <p className="card-text text-justufy">{props.description}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="modal" id={`modalEditNote${props.id}`} tabIndex="-1" aria-labelledby={`modalEditNoteLabel${props.id}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="" id={`modalEditNoteLabel${props.id}`}>Edit note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Formulario de editar */}

                            <div className="container">

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label d-flex">Title</label>
                                    <input className="form-control" id="title" type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label d-flex">Description</label>
                                    <textarea className="form-control" rows="3" id="description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                </div>

                            </div>

                        </div>
                        <div className="modal-footer">

                            {/* lista de categorias */}
                            <select className="form-select-padding-x-lg" aria-label="Default select example" value={category} onChange={(e) => { setCategory(e.target.value) }}>
                                <option value="{props.category}">Select category</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                                <option value="Finance">Finance</option>
                            </select>


                            <button type="button" className="btn btn-danger" onClick={(e) => { handleDeleteNote(props.id) }}>Delete</button>
                            <button type="submit" className="btn btn-primary">Edit</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};

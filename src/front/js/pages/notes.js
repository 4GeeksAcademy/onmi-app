import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { Cardnote } from "../component/cardnote";


export const Notes = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const { store, actions } = useContext(Context);
    // let navigate = useNavigate();

    const note = store.notes

    //console.log(title);
    //console.log(description);

    async function handleSubmit(e) {
        e.preventDefault();

        if (title == "" || description == "") {
            throw new Error("Error creating the note");
        } else {
            //console.log(title, description);
            let create = await actions.createNote(title, description, category)
            // console.log(create);

            if (create == true) {
                window.location.reload();
            }
        }
    }




    useEffect(() => {
        actions.notes();
    }, []);


    return (
        <div className="container" style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="container text-center mt-5">
                <h1>Notes</h1>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                    {note.length > 0 ? note.map((item) => <Cardnote key={item.id} id={item.id} title={item.title} description={item.description} category={item.category} />) : null}
                </div>
            </div>

            <div className="fixed-bottom d-flex justify-content-end p-4">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal2">New note</button>
            </div>

            <form onSubmit={handleSubmit} className="modal" id="modal2" tabIndex="-1" aria-labelledby="modal2Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modal2Label"> Hi! what idea do you want to save?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="container">
                                {/* <form onSubmit={handleSubmit}> */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label d-flex">Title</label>
                                    <input className="form-control" id="title" name="title" type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label d-flex">Description</label>
                                    <textarea className="form-control" rows="3" id="description" name="description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                </div>
                                {/* </form> */}
                            </div>

                        </div>
                        <div className="modal-footer">

                            {/* lista de categorias */}
                            <select className="form-select-padding-x-lg" aria-label="Default select example" id="category" name="category" value={category} onChange={(e) => { setCategory(e.target.value) }}>
                                <option defaultValue>Select category</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                                <option value="Finance">Finance</option>
                            </select>



                            <button type="submit" className="btn btn-primary">Create note</button>
                        </div>
                    </div>
                </div>
            </form>
        </div >
    )
};
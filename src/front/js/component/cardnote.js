import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Thememode } from "./Thememode"
import logo from "../../img/logo-sin-fondo.jpg"
import { FormNote } from "./formNote";


export const Cardnote = (props) => {
    // const { store, actions } = useContext(Context);
    // const note = store.notes
    console.log(props);
    




    return (
        <div className="col">
            <div className="card">
                <div className="card-body d-flex flex-column mb-3">

                    <div className="container d-flex justify-content-between">
                        <h5 className="card-title">{props.title}</h5>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="" id="exampleModalLabel">
                                                {/* lista de categorias */}
                                                <div className="dropdown-center">
                                                    <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Label
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><a className="dropdown-item" href="#">Health</a></li>
                                                        <li><a className="dropdown-item" href="#">Sport</a></li>
                                                        <li><a className="dropdown-item" href="#">Education</a></li>
                                                        <li><a className="dropdown-item" href="#">Finance</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {/* Formulario de editar */}
                                            
                                            <FormNote/>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Delete</button>
                                            <button type="button" className="btn btn-primary">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <p className="card-text text-justufy">{props.description}</p>
                </div>
            </div>
        </div>
    )
};

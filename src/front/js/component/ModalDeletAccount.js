import React, { useContext } from 'react';
import { Context } from "../store/appContext"; 
export const DeletAccount = () => {
    const { store, actions } = useContext(Context);
    

    return (

        <div>
            <button type="button" className="delete-account-button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Delete Account
            </button>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete Account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h5>Attention: This action cannot be undone.
                            If you delete your account, you will lose access to your profile, settings, and all associated data.
                            Do you really want to continue</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button"  onClick={()=>actions.AccountDelete()} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
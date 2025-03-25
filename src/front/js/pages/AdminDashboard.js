import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

const AdminDashboard = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await actions.getUsers();
            setLoading(false);
        };
        fetchData();
    }, [actions]);

    const handleDelete = async (userId) => {
        const Id = userId
        const success = await actions.deleteUser(Id);
        if (success) {
            alert("User deleted successfully!");
        } else {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="container" style={{ position: 'relative', minHeight: '100vh' }}>
            <h1>Admin Dashboard</h1>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;

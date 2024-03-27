import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const isAdminAPI = '/api/check-admin'; // Placeholder API endpoint
const adminDataAPI = '/api/admin-data'; // Placeholder API endpoint

// Simulate API call to check if user is an admin
const checkIfAdmin = async () => {
    return true //just until the api is set up
    try {
        const response = await axios.get(isAdminAPI);
        return response.data.isAdmin;
    } catch (error) {
        console.error("Error checking admin status", error);
        return false;
    }
};

// Simulate API call to get admin data
const fetchAdminData = async () => {
    try {
        const response = await axios.get(adminDataAPI);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin data", error);
        return [];
    }
};

const AdminPage = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [adminData, setAdminData] = useState([]);

    useEffect(() => {
        const verifyAdmin = async () => {
            const isAdmin = await checkIfAdmin();
            setIsAdmin(isAdmin);

            if (isAdmin) {
                const data = await fetchAdminData();
                setAdminData(data);
            }
        };

        verifyAdmin();
    }, []);

    if (isAdmin === false) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            {isAdmin ? (
                <div>
                    <h1>Admin Dashboard</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>API Calls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.apiCalls}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Checking admin status...</div>
            )}
        </div>
    );
};

export default AdminPage;

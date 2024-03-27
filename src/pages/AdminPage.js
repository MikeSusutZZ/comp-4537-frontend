import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const adminDataAPI = '/api/admin-data'; // Placeholder API endpoint for admin data

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
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState([]);

    useEffect(() => {
        // Attempt to fetch a protected route to check if the token is valid
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:4000/verify-token', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Unauthorized');
                
                // If authorized, fetch admin data
                const data = await fetchAdminData();
                setAdminData(data);

            } catch (error) {
                console.error(error);
                navigate('/');
            }
        };

        checkAuth();
    }, [navigate]); // Include navigate in the dependency array

    return (
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
    );
};

export default AdminPage;

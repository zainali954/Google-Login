import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/authContext';
import Loader from './components/Loader';

const App = () => {
    const { loading } = useAuth()

    return (
        <>
        { loading && <Loader/>}
            <Toaster />
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Route using PrivateRoute */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;

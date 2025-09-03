import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AutosProvider } from './AutosContext';
import { auth } from './firebase-config';
import NavBar from './NavBar';
import AdminPanel from './AdminPanel';
import Autos from './Autos';
import Fahrer from './Fahrer';
import DriverDocuments from './DriverDocuments';
import AutoDriverLogs from './AutoDriverLogs';
import DriverInfos from './DriverInfos';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <AutosProvider>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/autos"
                        element={
                            <ProtectedRoute>
                                <Autos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/fahrer"
                        element={
                            <ProtectedRoute>
                                <Fahrer />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/fahrer/documents/:fahrerId"
                        element={
                            <ProtectedRoute>
                                <DriverDocuments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                       path="/fahrer/driverinfos"
                        element={
                            <ProtectedRoute>
                                <DriverInfos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/autoDriverLogs"
                        element={
                            <ProtectedRoute>
                                <AutoDriverLogs />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
            </AutosProvider>
        </Router>
    );
}

export default App;

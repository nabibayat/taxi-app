import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase-config';

/**
 * ProtectedRoute
 * @param {ReactNode} children - The component to render if authenticated
 */
function ProtectedRoute({ children }) {
    const user = auth.currentUser; // Get the currently logged-in user

    if (!user) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/" />;
    }

    return children; // If authenticated, render the child component
}

export default ProtectedRoute;

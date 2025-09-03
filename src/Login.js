import React, { useState, useContext } from 'react';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
           
            navigate('/fahrer'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed: ', error.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-panel">
                <img 
                    src="/images/Pooyesh.png" 
                    alt="Pooyesh Logo" 
                    className="login-logo"
                />
                {error && <p className="login-error">{error}</p>}
                <div className="login-input">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email Address"
                    />
                </div>
                <div className="login-input">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=" Enter Password "
                    />
                </div>
                <button className="login-button" onClick={handleLogin}>
                    Enter
                </button>
            </div>
        </div>
    );
}

export default Login;

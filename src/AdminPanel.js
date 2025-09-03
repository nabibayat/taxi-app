import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from './firebase-config';

function AdminPanel() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [signupError, setSignupError] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
            });
            fetchUsers(); // Refresh user list after signing up a new user
            setEmail('');
            setPassword('');
            setSignupError('');
        } catch (error) {
            setSignupError(error.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const usersCol = collection(db, 'users');
            const userSnapshot = await getDocs(usersCol);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Admin Panel</h1>
            <div className="card p-3">
                <h2>Signup New User</h2>
                <form onSubmit={handleSignup} className="mb-3">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Signup</button>
                    {signupError && <p className="text-danger">{signupError}</p>}
                </form>
            </div>
            <div className="card p-3 mt-3">
                <h2>User List</h2>
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user.id} className="p-2">
                            <p>{user.email} - User ID: {user.id}</p>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;

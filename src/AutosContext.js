import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export const AutosContext = createContext();

export const AutosProvider = ({ children }) => {
    const [autos, setAutos] = useState([]);

    const fetchAutos = async () => {
        const autosCollection = collection(db, 'autos');
        const autosSnapshot = await getDocs(autosCollection);
        const autosList = autosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAutos(autosList);
    };

    useEffect(() => {
        fetchAutos();
    }, []);

    return (
        <AutosContext.Provider value={{ autos, fetchAutos }}>
            {children}
        </AutosContext.Provider>
    );
};

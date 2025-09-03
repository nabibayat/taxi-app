import React, { useState, useEffect, useContext } from "react";
import { db } from "./firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "react-bootstrap";
import DriverCard from "./DriverCard";
import { useNavigate } from "react-router-dom";
import { AutosContext } from "./AutosContext"; // Import AutosContext

function Fahrer() {
    const [fahrerData, setFahrerData] = useState([]);
    const { autos } = useContext(AutosContext); // Consume autos from context

    const navigate = useNavigate();

    useEffect(() => {
        fetchFahrerAndAutos();
    }, [autos]); // Re-fetch when autos change

    const fetchFahrerAndAutos = async () => {
        const fahrerData = await getDocs(collection(db, "fahrer"));
        const fahrer = fahrerData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Fetch assignments
        const assignmentsSnapshot = await getDocs(query(collection(db, "AutoDriverLogs"), orderBy("dateTakeover", "desc")));
        const assignments = {};
        assignmentsSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (!assignments[data.DriverID] || assignments[data.DriverID].dateTakeover < data.dateTakeover) {
                assignments[data.DriverID] = { ...data, logId: doc.id };
            }
        });

        const combinedData = fahrer.map(f => ({
            ...f,
            autoAssignment: assignments[f.id],
            assignedAuto: autos.find(auto => auto.id === assignments[f.id]?.AutoId)
        }));

        setFahrerData(combinedData);
    };

    
    const handleNewFahrerClick = () => {
        navigate("/fahrer/driverinfos", { state: {} });
    };

    return (
        <div className="container mt-3">
            <h1>.</h1>
            <Button onClick={handleNewFahrerClick}>New Fahrer</Button>
            {fahrerData.map((f) => (
                <div key={f.id}>
                    <DriverCard
                        driver={f}
                        autoAssignment={f.autoAssignment}
                        assignedAuto={f.assignedAuto}
                    />
                </div>
            ))}
        </div>
    );
}

export default Fahrer;

import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button, Table, Form } from 'react-bootstrap';
import './App.css'; // Import the CSS file

function AutoDriverLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDriver, setFilterDriver] = useState(''); // Filter for Driver column
    const [drivers, setDrivers] = useState([]); // List of drivers for the dropdown filter

    // Fetch all logs, autos, and drivers
    const fetchLogs = async () => {
        setLoading(true);
        const logsSnapshot = await getDocs(collection(db, 'AutoDriverLogs'));
        const logsData = await Promise.all(
            logsSnapshot.docs.map(async (logDoc) => {
                const log = logDoc.data();
                log.id = logDoc.id;

                // Fetch auto details
                if (log.AutoId) {
                    const autoDoc = await getDoc(doc(db, 'autos', log.AutoId));
                    log.autoDetails = autoDoc.exists() ? autoDoc.data() : {};
                }

                // Fetch fahrer details
                if (log.DriverID) {
                    const fahrerDoc = await getDoc(doc(db, 'fahrer', log.DriverID));
                    log.fahrerDetails = fahrerDoc.exists() ? { ...fahrerDoc.data(), id: log.DriverID } : {};
                }

                return log;
            })
        );

        setLogs(logsData);
        setLoading(false);
    };

    // Fetch driver list for dropdown filter
    const fetchDrivers = async () => {
        const fahrerSnapshot = await getDocs(collection(db, 'fahrer'));
        const fahrerData = fahrerSnapshot.docs.map((doc) => ({
            id: doc.id,
            vorname: doc.data().vorname,
            nachname: doc.data().nachname,
        }));
        setDrivers(fahrerData);
    };

    useEffect(() => {
        fetchLogs();
        fetchDrivers();
    }, []);

    // Filter logs based on selected driver
    const filteredLogs = filterDriver
        ? logs.filter((log) => log.DriverID === filterDriver)
        : logs;

        
    return (
        <div className="container mt-3">
            <h1>Auto Driver Logs</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th  className="serial-column">Serial</th>
                        <th>
                            {/* Driver Dropdown Filter */}
                            <Form.Control
                                as="select"
                                value={filterDriver}
                                onChange={(e) => setFilterDriver(e.target.value)}
                            >
                                <option value="">All Drivers</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.vorname} {driver.nachname}
                                    </option>
                                ))}
                            </Form.Control>
                        </th>
                        <th>Auto</th>
                        <th>Date Takeover</th>
                        <th>Date Handover</th>

                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, index) => (
                        <React.Fragment key={log.id}>
                            <tr>
                                <td  className="serial-column">{index + 1}</td>
                                <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    {/* Driver Name */}
                                    <span>
                                        {log.fahrerDetails
                                            ? `${log.fahrerDetails.vorname} ${log.fahrerDetails.nachname}`
                                            : 'No Driver Info'}
                                    </span>

                                    {/* Driver Photo */}
                                    {log.fahrerDetails && log.fahrerDetails.fahrerPhoto && (
                                        <img
                                            src={log.fahrerDetails.fahrerPhoto}
                                            alt="Driver"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                marginTop: '10px',
                                                borderRadius: '5px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        {/* Auto Name */}
                                        <span>
                                            {log.autoDetails
                                                ? `${log.autoDetails.marke} ${log.autoDetails.modell}`
                                                : 'No Auto Info'}
                                        </span>

                                        {/* Auto Photo */}
                                        {log.autoDetails && log.autoDetails.AutoPhoto && (
                                            <img
                                                src={log.autoDetails.AutoPhoto}
                                                alt="Auto"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    marginTop: '10px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                        )}
                                    </div>
                                </td>

                                <td>{log.dateTakeover}</td>
                                <td>{log.dateHandover || 'Not Set'}</td>

                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            {loading && <p>Loading logs...</p>}
        </div>
    );
}

export default AutoDriverLogs;

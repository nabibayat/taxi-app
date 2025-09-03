import './Autos.css'; // Ensure this is the correct path to your CSS file

import React, { useState, useEffect, useContext } from 'react';
import { db, storage } from './firebase-config';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AutosContext } from './AutosContext'; // Import AutosContext

function Autos() {
    const { autos, fetchAutos } = useContext(AutosContext); // Consume autos and fetchAutos from context
    const [formData, setFormData] = useState({
        kennzeichennummer: '',
        fahrzeugTyp: '',
        marke: '',
        modell: '',
        kraftstoffArt: '',
        farbe: '',
        AutoPhoto: ''  // the image Base64
    });
    const [file, setFile] = useState(null);
    const [downloadURL, setDownloadURL] = useState("");
    const [selectedAutoId, setSelectedAutoId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Delete auto using Firebase SDK v9
    const deleteAuto = async (id) => {
        await deleteDoc(doc(db, 'autos', id));
        fetchAutos();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64data = loadEvent.target.result;
                setFormData({
                    ...formData,
                    AutoPhoto: base64data  // Save as a base64 string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add a new auto
    const handleNewAuto = () => {
        setIsEditing(false);
        setSelectedAutoId(null);
        setFormData({
            kennzeichennummer: '',
            fahrzeugTyp: '',
            marke: '',
            modell: '',
            kraftstoffArt: '',
            farbe: '',
            AutoPhoto: ''
        });

        setShowModal(true);
    };

    // Start editing an auto
    const startEdit = (auto) => {
        setIsEditing(true);
        setSelectedAutoId(auto.id);
        setFormData(auto);
        setShowModal(true);
    };

    // Save or update an auto
    const saveAuto = async () => {
        if (isEditing && selectedAutoId) {
            // Update existing auto
            const autoRef = doc(db, 'autos', selectedAutoId);
            await updateDoc(autoRef, formData);
        } else {
            // Add new auto
            await addDoc(collection(db, 'autos'), formData);
        }

        setShowModal(false); // Close modal
        fetchAutos(); // Refresh autos
    };

    // Upload function
    const handleUpload = () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error("Upload failed:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log("File available at", url);
                    setDownloadURL(url);
                });
            }
        );
    };

    return (
        <div className="container mt-3">
            <h1>Autos</h1>
            <Button onClick={handleNewAuto} className="ml-3">New Auto</Button>
            {autos.map(auto => (
                <div key={auto.id} className="card mb-2">
                    <div className="card-body">
                        <h5 className="card-title">{auto.marke} {auto.modell}</h5>
                        <p className="card-text">Kennzeichennummer: {auto.kennzeichennummer}</p>
                        <p className="card-text">FahrzeugTyp: {auto.fahrzeugTyp}</p>
                        <p className="card-text">KraftstoffArt: {auto.kraftstoffArt}</p>
                        <p className="card-text">Farbe: {auto.farbe}</p>
                        <div className="image-container">
                            {auto.AutoPhoto && <img src={auto.AutoPhoto} alt="Car" />}
                            <div className="button-group">
                                <button className="btn btn-danger" onClick={() => deleteAuto(auto.id)}>Delete</button>
                                <button className="btn btn-primary" onClick={() => startEdit(auto)}>Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Auto" : "Add New Auto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Kennzeichennummer</Form.Label>
                            <Form.Control type="text" name="kennzeichennummer" value={formData.kennzeichennummer} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>FahrzeugTyp</Form.Label>
                            <Form.Control type="text" name="fahrzeugTyp" value={formData.fahrzeugTyp} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Marke</Form.Label>
                            <Form.Control type="text" name="marke" value={formData.marke} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Modell</Form.Label>
                            <Form.Control type="email" name="modell" value={formData.modell} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>KraftstoffArt</Form.Label>
                            <Form.Control type="text" name="kraftstoffArt" value={formData.kraftstoffArt} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Farbe</Form.Label>
                            <Form.Control type="text" name="farbe" value={formData.farbe} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo</Form.Label>
                            <Form.Control type="file" name="AutoPhoto" onChange={handleImageChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={saveAuto}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Autos;

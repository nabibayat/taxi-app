import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase-config'; // Ensure correct paths
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import documentTypes from './documentTypes';
import "./DriverDocuments.css";
import { FaDownload } from 'react-icons/fa'; // Import download icon

const DriverDocuments = () => {
    const [filterDocType, setFilterDocType] = useState(''); // Filter state
    const [expandedDocId, setExpandedDocId] = useState(null); // Track expanded document
    const [documents, setDocuments] = useState([]);
    const [showDocModal, setShowDocModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [file, setFile] = useState(null); // File input state
    const [docData, setDocData] = useState({
        driverId: '',
        name: '',
        docType: '',
        docContent: '', // Will hold file URL
        date: '',
    });

    const navigate = useNavigate();
    const { fahrerId } = useParams();
    const location = useLocation();
    const { vorname, nachname } = location.state || {};

    // Fetch documents for the specific driver
    useEffect(() => {
        fetchDocuments();
    }, [fahrerId]);

    const fetchDocuments = async () => {
        if (!fahrerId) return;
        const querySnapshot = await getDocs(collection(db, `fahrer/${fahrerId}/documents`));
        const docsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docsArray);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setSelectedDocId(null);
        setFile(null);
        setDocData({
            driverId: fahrerId,
            name: '',
            date: new Date().toISOString().split('T')[0],
            docType: '',
            docContent: '',
        });
        setShowDocModal(true);
    };

    const handleEdit = (doc) => {
        setIsEditing(true);
        setSelectedDocId(doc.id);
        setFile(null);
        setDocData(doc);
        setShowDocModal(true);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, `fahrer/${fahrerId}/documents`, id));
        fetchDocuments();
    };

    const handleSave = async () => {
        try {
            let fileUrl = docData.docContent;

            if (file) {
                const fileRef = ref(storage, `fahrer/${fahrerId}/documents/${file.name}`);
                await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(fileRef);
            }

            const newDocData = { ...docData, docContent: fileUrl };

            if (isEditing && selectedDocId) {
                const docRef = doc(db, `fahrer/${fahrerId}/documents`, selectedDocId);
                await updateDoc(docRef, newDocData);
            } else {
                await addDoc(collection(db, `fahrer/${fahrerId}/documents`), newDocData);
            }

            setShowDocModal(false);
            fetchDocuments();
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocData({ ...docData, [name]: value });
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleBack = () => {
        navigate('/fahrer');
    };

    // Filtered documents based on dropdown selection
    const filteredDocuments = filterDocType
        ? documents.filter((doc) => doc.docType === filterDocType)
        : documents;

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename || 'document';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl); // Clean up the URL
        } catch (error) {
            console.error('Error during file download:', error);
        }
    };

    return (
        <div className="container mt-3">
            <h5>{vorname} {nachname}</h5>
            <div className="mb-3">
                <Button variant="primary" onClick={handleAdd}>Add Document</Button>
                <Button variant="secondary" onClick={handleBack} className="ml-2">Back to Fahrer</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Serial</th>
                        <th>Doc Name</th>
                        <th>
                            <Form.Control
                                as="select"
                                value={filterDocType}
                                onChange={(e) => setFilterDocType(e.target.value)}
                            >
                                <option value="">All</option>
                                {documentTypes.map((type) => (
                                    <option key={type.id} value={type.label}>
                                        {type.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </th>
                        <th>Doc</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredDocuments.map((doc, index) => (
                        <React.Fragment key={doc.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{doc.name}</td>
                                <td>{doc.docType}</td>
                                <td>
                                    <span
                                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => setExpandedDocId(expandedDocId === doc.id ? null : doc.id)}
                                    >
                                        {expandedDocId === doc.id ? 'Hide Document' : 'View Document'}
                                    </span>
                                    <FaDownload
                                        style={{ color: 'blue', cursor: 'pointer', marginLeft: '10px' }}
                                        onClick={() => handleDownload(doc.docContent, doc.name)}
                                    />
                                </td>
                                <td>{doc.date}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(doc)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)} className="ml-2">Delete</Button>
                                </td>
                            </tr>
                            {expandedDocId === doc.id && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="document-preview">
                                            <iframe
                                                src={doc.docContent}
                                                title="Document Preview"
                                                width="100%"
                                                height="500px"
                                                style={{ border: "none" }}
                                            ></iframe>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Document */}
            <Modal show={showDocModal} onHide={() => setShowDocModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Document' : 'Add Document'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name/Desc of Document</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={docData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Doc Type</Form.Label>
                            <Form.Control as="select" name="docType" value={docData.docType} onChange={handleChange}>
                                <option value="">Select Document Type</option>
                                {documentTypes.map(type => (
                                    <option key={type.id} value={type.label}>{type.label}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Upload Document</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDocModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DriverDocuments;

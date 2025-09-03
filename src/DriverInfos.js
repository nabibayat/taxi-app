import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // For accessing state and navigating
import { Button, Form } from 'react-bootstrap'; // For Bootstrap styling
import { db } from './firebase-config'; // Firebase config
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For uploading photos to Firebase
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'; // For Firestore document functions
import OvalImage from './Components/OvalImage'; // Assuming OvalImage is correctly imported
import AssignAutoModal from './AssignAutoModal'; // Import AssignAutoModal component

function DriverInfos() {
    const location = useLocation(); // Get the location object which contains the state
    const navigate = useNavigate(); // Initialize navigate for routing

    // Destructure state data passed from the previous page (for editing an existing driver or creating a new one)
    const {
        vorname = '',
        nachname = '',
        emailAdresse = '',
        telefonnummer = '',
        fahrerPhoto = '',
        birthdate = '', // Add birthdate field
        id,
        autoAssignment = null, // Add autoAssignment field
        assignedAuto = null, // Add assignedAuto field
        idCard,
        driverLicense,
        taxiSchein
    } = location.state || {};  // Default to empty values if nothing is passed

    const [driverData, setDriverData] = useState({
        vorname: vorname,
        nachname: nachname,
        emailAdresse: emailAdresse,
        telefonnummer: telefonnummer,
        fahrerPhoto: fahrerPhoto || '/images/placeholder.jpg', // Default placeholder photo if none is provided
        birthdate: birthdate, // Add birthdate field
        VSNR: '', // Add VSNR field
        autoAssignment: autoAssignment, // Add autoAssignment field
        assignedAuto: assignedAuto, // Add assignedAuto field
        driverId: id, // Ensure driverId is included
        idCard: idCard,// Add idCard field
        driverLicense: driverLicense,
        taxiSchein
    });

  
    const [showAssignAutoModal, setShowAssignAutoModal] = useState(false); // Define showAssignAutoModal state

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriverData({ ...driverData, [name]: value });
    };

    // Generalized file upload handler
    const handleFileUpload = async (e, fieldName, folderName) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(getStorage(), `${folderName}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setDriverData({ ...driverData, [fieldName]: downloadURL });
        }
    };

    // Save the driver information to Firebase
    const handleSave = async () => {
        if (!driverData.vorname || !driverData.nachname) {
            alert('Please fill in all fields.');
            return;
        }

        if (id) {
            // If there's an id (editing an existing driver), update the existing document in Firestore
            const driverRef = doc(db, 'fahrer', id);
            await updateDoc(driverRef, {
                vorname: driverData.vorname,
                nachname: driverData.nachname,
                emailAdresse: driverData.emailAdresse,
                telefonnummer: driverData.telefonnummer,
                fahrerPhoto: driverData.fahrerPhoto,
                birthdate: driverData.birthdate, // Add birthdate field
                VSNR: driverData.VSNR, // Add VSNR field
                autoAssignment: driverData.autoAssignment, // Add autoAssignment field
                assignedAuto: driverData.assignedAuto, // Add assignedAuto field
                idCard: driverData.idCard, // Add idCard field
                driverLicense: driverData.driverLicense // Add idCard field
            });
        } else {
            // Otherwise, create a new driver document in Firestore
            await addDoc(collection(db, 'fahrer'), driverData);
        }

        // After saving, navigate back to the previous page
        navigate(-1); // Go back to the previous page in the browser history
    };


    const handleHideModal = () => {
        setShowAssignAutoModal(false);
    };

    return (
        <div className="container mt-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <OvalImage src={driverData.fahrerPhoto} alt="Placeholder Auto Photo" borderRatio="50%" size={70} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Control
                            type="text"
                            name="vorname"
                            value={driverData.vorname}
                            onChange={handleChange}
                            placeholder="First Name"
                        />
                        <Form.Control
                            type="text"
                            name="nachname"
                            value={driverData.nachname}
                            onChange={handleChange}
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Form.Control
                        type="email"
                        name="emailAdresse"
                        value={driverData.emailAdresse}
                        onChange={handleChange}
                        placeholder="Email Address"
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Form.Control
                        type="text"
                        name="telefonnummer"
                        value={driverData.telefonnummer}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <OvalImage src={driverData.assignedAuto?.AutoPhoto ? driverData.assignedAuto.AutoPhoto : "/images/auto.jpg"} alt="Placeholder Auto Photo" borderRatio="50%" size={70} />

                        <h5 className="fw-semibold">{driverData.assignedAuto?.marke}  {driverData.assignedAuto?.modell}</h5>
                        <Button variant="primary" onClick={() => setShowAssignAutoModal(true)}>
                            Assign Auto
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Form.Control
                        type="text"
                        name="VSNR"
                        value={driverData.VSNR}
                        onChange={handleChange}
                        placeholder="VSNR"
                    />
                </div>


            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Group style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Form.Label>Geburtsdatum:</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthdate"
                            value={driverData.birthdate}
                            onChange={handleChange}
                            placeholder="Geburtsdatum"
                            style={{ width: '210px' }} // Increase width
                        />
                    </Form.Group>
                </div>
            </div>
            <Form className="mt-3">
                <Form.Group style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Label style={{ width: '105px' }}>ID Card:</Form.Label>
                    <Form.Control
                        type="file"
                        name="idCard"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'idCard', 'idCardPhotos')}
                        placeholder="ID Card Photo"
                    />
                    {driverData.idCard && (
                        <Button variant="secondary" href={driverData.idCard} download style={{ marginLeft: '10px' }}>
                            Download
                        </Button>
                    )}
                </Form.Group>
                <Form.Group style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Label style={{ width: '85px' }}>Fuhrerschein:</Form.Label>
                    <Form.Control
                        type="file"
                        name="driverLicense"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'driverLicense', 'driverLicensePhotos')}
                        placeholder="Fuhrerschein Photo"
                    />
                    {driverData.driverLicense && (
                        <Button variant="secondary" href={driverData.driverLicense} download style={{ marginLeft: '10px' }}>
                            Download
                        </Button>
                    )}
                </Form.Group>
                <Form.Group style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Label style={{ width: '105px' }}>taxiSchein:</Form.Label>
                    <Form.Control
                        type="file"
                        name="taxiSchein"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'taxiSchein', 'taxiScheinPhotos')}
                        placeholder="TaxiSchein Photo"
                    />
                    {driverData.taxiSchein && (
                        <Button variant="secondary" href={driverData.taxiSchein} download style={{ marginLeft: '10px' }}>
                            Download
                        </Button>
                    )}
                </Form.Group>
            </Form>
            <Button className="mt-3" onClick={handleSave}>
                {id ? 'Save Changes' : 'Save New Driver'}
            </Button>
            <Button className="mt-3 ml-3" onClick={() => navigate(-1)}>Back</Button>
            {showAssignAutoModal && (
                <AssignAutoModal
                    show={showAssignAutoModal}
                    onHide={handleHideModal}
                    driverData={driverData}
                    setDriverData={setDriverData}
                />
            )}
        </div>
    );
}

export default DriverInfos;


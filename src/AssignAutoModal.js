import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AutosContext } from './AutosContext'; // Import AutosContext
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore functions
import { db } from './firebase-config'; // Import Firebase config

function AssignAutoModal({ show, onHide, driverData, setDriverData }) {
  const { autos } = useContext(AutosContext); // Use AutosContext to get autos data
  const [selectedAuto, setSelectedAuto] = useState(null); // Define selectedAuto state variable
  const [dateTakeover, setDateTakeover] = useState(''); // State to hold assignment date

  console.error(driverData.driverId);

  // Handle auto assignment
  const handleAssignAuto = async () => {
    if (!driverData.driverId || !dateTakeover) {
      console.error("date takeover is missing.");
      return;
    }
    const newAssignment = {
      DriverID: driverData.driverId,
      AutoId: selectedAuto.id,
      dateTakeover: dateTakeover,
      dateHandover: "",
    };
    // Add new assignment to Firestore
    await addDoc(collection(db, "AutoDriverLogs"), newAssignment);

    setDriverData({ ...driverData, assignedAuto: selectedAuto, autoAssignment: newAssignment });

    console.log("Calling onHide");
    onHide(); // Ensure onHide is called here
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select an Auto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {autos.map((auto) => (
          <div key={auto.id} onClick={() => {
            setSelectedAuto(auto);
          }}>
            <p>{auto.marke} {auto.modell}</p>
            <img src={auto.AutoPhoto} alt="Auto" style={{ width: "100%" }} />
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Form.Group>
          <Form.Label>Date Takeover</Form.Label>
          <Form.Control
            type="date"
            value={dateTakeover}
            onChange={(e) => setDateTakeover(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleAssignAuto}>Confirm Assignment</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignAutoModal;

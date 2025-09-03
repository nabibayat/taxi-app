import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FahrerModal = ({
  show,
  onHide,
  isEditing,
  driverData,
  onChange,
  onSave,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{isEditing ? "Edit Fahrer" : "Add New Fahrer"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Vorname</Form.Label>
          <Form.Control
            type="text"
            name="vorname"
            value={driverData.vorname}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nachname</Form.Label>
          <Form.Control type="text" name="nachname" value={driverData.nachname} onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Geburtsort</Form.Label>
          <Form.Control type="text" name="geburtsort" value={driverData.geburtsort} onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email Adresse</Form.Label>
          <Form.Control type="email" name="emailAdresse" value={driverData.emailAdresse} onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telefonnummer</Form.Label>
          <Form.Control type="text" name="telefonnummer" value={driverData.telefonnummer} onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Taxischein Image</Form.Label>
          <Form.Control type="file" name="taxischeinImage" onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Taxischein Ablaufdatum</Form.Label>
          <Form.Control type="date" name="taxischeinAblaufdatum" value={driverData.taxischeinAblaufdatum} onChange={onChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ausweis Image</Form.Label>
          <Form.Control
            type="file"
            name="ausweis"
            accept="image/*"
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ausweis Ablaufdatum</Form.Label>
          <Form.Control type="date" name="ausweisAblaufdatum" value={driverData.ausweisAblaufdatum} onChange={onChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Fahrer Photo</Form.Label>
          <Form.Control
            type="file"
            name="fahrerPhoto"
            accept="image/*"
            onChange={onChange}
          />
        </Form.Group>
        {/* Repeat other form fields here */}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>
);

export default FahrerModal;

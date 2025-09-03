import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const HandoverDateModal = ({
  show,
  onHide,
  handoverDate,
  onDateChange,
  onSave,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Set Unassign Date</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group>
        <Form.Label>Unassign Date</Form.Label>
        <Form.Control
          type="date"
          value={handoverDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>
);

export default HandoverDateModal;

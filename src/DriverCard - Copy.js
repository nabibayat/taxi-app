import React from "react";
import { Button } from "react-bootstrap";
import './DriverCard.css'; // New CSS file for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OvalImage from './Components/OvalImage';

const DriverCard = ({
  driver,
  autoAssignment,
  assignedAuto,
  onDelete,
  onEdit,
  onAssignAuto,
  onSetUnassignDate,
}) => {
  console.log(driver.fahrerPhoto);

  const navigate = useNavigate(); // Initialize navigate

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Maintain aspect ratio and cover the container
    maxWidth: 'none' //prevent image from exceeding container size
  };

  return (
    <div className="card mb-3 driver-card">
      <table className="driver-card-table">
        <tbody>
          {/* Row 1: Driver and Auto Details */}
          <tr>
            <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {driver.fahrerPhoto && (
                <OvalImage src={driver.fahrerPhoto} alt="User Avatar" size={100} />
              )}
              <div> {/* Container for the name */}
                <h5>{driver.vorname} {driver.nachname}</h5>
              </div>
            </td>
            <td>
              {assignedAuto && (
                <div>
                  <h5>Assigned Auto: {assignedAuto.marke} {assignedAuto.modell}</h5>
                  <img
                    src={assignedAuto.AutoPhoto}
                    alt="Assigned Auto"
                    className="assigned-auto-photo"
                  />
                </div>
              )}
            </td>
          </tr>

          {/* Row 2: Buttons */}
          <tr>
            <td className="driver-buttons">
              <div className="driver-button-group">
                <Button variant="danger" onClick={onDelete}>Delete</Button>
                <Button variant="primary" onClick={onEdit}>Edit</Button>
                <Button variant="info" onClick={onAssignAuto}>Assign Auto</Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/fahrer/documents/${driver.id}`, {
                    state: { vorname: driver.vorname, nachname: driver.nachname }
                  })}
                >
                  Driver Documents
                </Button>
              </div>
            </td>
            <td className="auto-actions">
            {assignedAuto && (
              <OvalImage src={assignedAuto.AutoPhoto} alt="User Avatar" size={100} />
                // <div>
                //   <h5>Assigned Auto: {assignedAuto.marke} {assignedAuto.modell}</h5>
                //   <img
                //     src={assignedAuto.AutoPhoto}
                //     alt="Assigned Auto"
                //     className="assigned-auto-photo"
                //   />
                // </div>
              )}
              {autoAssignment && (
                <>
                  <h5>Assign Date: {autoAssignment.dateTakeover}</h5>
                  <h5>Unassign Date: {autoAssignment.dateHandover || 'Not Set'}</h5>
                  <Button
                    variant="warning"
                    onClick={onSetUnassignDate}
                  >
                    Set Unassign Date
                  </Button>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DriverCard;

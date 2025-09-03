import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OvalImage from './Components/OvalImage'; // Assuming OvalImage is correctly imported
import "./DriverCard.css";

const DriverCard = ({
  driver,
  
}) => {

  const navigate = useNavigate(); // Initialize navigate

  const handleEditClick = () => {
    // Navigate to DriverInfos page for editing an existing driver
    // Ensure we are passing only the driver data, not the event object
    navigate("/fahrer/driverinfos", { state: { ...driver } });
  };

  return (
    <div className="card driver-card shadow-sm p-3 mb-3 rounded bg-light">
      <div className="d-flex justify-content-between align-items-center">
        {/* Driver Info Section */}
        <div className="d-flex align-items-center gap-3">
          {driver.fahrerPhoto && (
            <OvalImage src={driver.fahrerPhoto} alt="User Avatar" borderRatio="50%" size={60} />
          )}
          <div>
            <h5 className="fw-semibold">{driver.vorname} {driver.nachname}</h5>
          </div>
        </div>

        {/* Auto Info Section */}
        <div className="d-flex flex-column align-items-start gap-3">
          {driver.assignedAuto ? (
            <div className="d-flex align-items-center gap-3">
              <OvalImage
                src={driver.assignedAuto.AutoPhoto ? driver.assignedAuto.AutoPhoto : "/images/auto.jpg"}
                alt="Auto Photo"
                borderRatio="50%"
                size={60}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <h5 className="fw-semibold">{driver.assignedAuto.marke} {driver.assignedAuto.modell}</h5>
                 <h5 className="fw-semibold">{driver.autoAssignment.dateTakeover} </h5>
                </div>
             
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <OvalImage src="/images/auto.jpg" alt="Placeholder Auto Photo" borderRatio="50%" size={60} />
              <h5 className="fw-semibold">No Auto Assigned</h5>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3">
          {/* Edit Button */}
          <Button className="btn btn-primary" onClick={handleEditClick}>Details</Button>
          
          {/* Driver Documents Button */}
          <Button className="btn btn-success"
            variant="secondary"
            onClick={() => navigate(`/fahrer/documents/${driver.id}`, {
              state: { vorname: driver.vorname, nachname: driver.nachname }
            })}
          >
            Driver Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;

import React from 'react';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      {/* Show the doctor's image with a fallback if no image exists */}
      <img
        src={doctor.image ? `http://localhost:5000${doctor.image}` : "https://via.placeholder.com/80"}
        alt={doctor.name}
        className="doctor-image"
      />

      <div className="doctor-card-content">
        <h4>{doctor.name}</h4>
        <p className="specialization">{doctor.specialization}</p>
        <p className="experience-location">
          <span>{doctor.experience} years</span>
        </p>
      </div>

      <div className="doctor-card-actions">
        <div className="doctor-fees">
          <div className="fees">₹{doctor.fees}</div>
          <div className="consult-button">
            {/* Conditional rendering for Consult Online/Visit with corresponding class */}
            {doctor.modeOfConsult === 'Online' ? (
              <button className="consult-online">Consult Online</button>
            ) : (
              <button className="consult-visit">Consult Visit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

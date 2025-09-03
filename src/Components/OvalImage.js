import React from 'react';

const OvalImage = ({ src, alt, borderRatio, size = 100, borderColor = '#ccc', borderWidth = '2px' }) => {
    const containerStyle = {
      width: size * 1, // Adjust for oval shape
      height: size,
      borderRadius: borderRatio, // Make it round
      overflow: 'hidden', // Hide overflowing image parts
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: `${borderWidth} solid ${borderColor}`, // Added border
    };
    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover', // Maintain aspect ratio and cover the container
      maxWidth: 'none', // Prevent image from exceeding container size
    };
  
    return (
      <div style={containerStyle}>
        <img src={src} alt={alt} style={imageStyle} />
      </div>
    );
  };
  

export default OvalImage;
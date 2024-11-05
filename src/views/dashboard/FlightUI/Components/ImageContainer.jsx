import React from 'react';
import './ImageContainer.css'; // Custom CSS for ImageContainer

const ImageContainer = ({ images = [] }) => {
    return (
        <div className={`image-container image-count-${images.length}`}>
            {images.map((image, index) => {
                // console.log(image, "Image value is")

                return (
                    <div key={index} className={`image-item`}>
                        <img src={`https://gateway.aahaas.com/Airlines/${image}.png`} alt={`Airline Logo ${index + 1}`} className="airline-logo" />
                    </div>

                )

            })}
        </div>
    );
};

export default ImageContainer;

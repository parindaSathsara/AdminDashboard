import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    const totalStars = 5;

    return (
        <div>
            {[...Array(totalStars)].map((star, index) => {
                const starIndex = index + 1;
                return (
                    <FaStar
                        key={starIndex}
                        color={starIndex <= rating ? "#ffc107" : "#e4e5e9"}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;

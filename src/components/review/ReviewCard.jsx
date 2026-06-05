import React from "react";
import '../../index.css';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-item" key={review._id}>
      <p className="review">{review.review}</p>
      <div className="reviewData">
        <p className="name">By: {review.name}</p>
        <p className="date">{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ReviewCard;


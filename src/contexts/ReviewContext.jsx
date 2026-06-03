import React, { createContext, useState } from 'react';
import { reviewsApi } from '../services/api';
import { notify } from '../utils/toast';

export const ReviewContext = createContext();

const ReviewState = (props) => {
  const [reviews, setReviews] = useState([]);
  const [load, setLoad] = useState(true);

  // View all reviews
  const fetchReviews = async () => {
    props.setProgress(30);
    setLoad(true);

    try {
      const { data } = await reviewsApi.getAll();
      props.setProgress(70);

      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to fetch reviews');
    }

    setLoad(false);
    props.setProgress(100);
  };

  // Add a review
  const addReview = async (name, review) => {
    setLoad(true);

    try {
      const { data } = await reviewsApi.create(name, review);

      if (data.success) {
        setReviews((prev) => [data.data, ...prev]);
        notify.success('Review posted');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to post review');
    }

    setLoad(false);
  };

  return (
    <ReviewContext.Provider value={{ load, reviews, fetchReviews, addReview }}>
      {props.children}
    </ReviewContext.Provider>
  );
};

export default ReviewState;

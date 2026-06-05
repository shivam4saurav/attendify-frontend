import React, { useState, useContext } from 'react';
import '../../index.css';
import { motion } from 'framer-motion';
import {reviewsApi} from '../../services/api';
import {notify} from '../../utils/toast';


const ReviewForm = ({setAllReviews}) => {
  const [postReview, setPostReview] = useState({ name: '', review: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addReview = async (name, review) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await reviewsApi.create(name, review);

      if (data.success) {
        console.log("setAllReviews", setAllReviews);
        setAllReviews((prev) => {
          console.log("prev", prev);
          return [data.data, ...prev];
        });
        notify.success('Review posted');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to post review');
    }

    setLoading(false);
  };

  const handleReviewChange = (event) => {
    setPostReview({ ...postReview, [event.target.name]: event.target.value });
  };

  const handleAddReview = (event) => {
    event.preventDefault();
    addReview(postReview.name, postReview.review);
    setPostReview({ name: '', review: '' });
  };

  return (
    <motion.div
      className="add-reviews"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <h1>Post a review</h1>
      <form onSubmit={handleAddReview} method="post">
        <input
          type="text"
          name="name"
          value={postReview.name}
          placeholder="Enter name"
          onChange={handleReviewChange}
          required
        />
        <textarea
          name="review"
          value={postReview.review}
          placeholder="Enter feedback"
          onChange={handleReviewChange}
          required
        ></textarea>
        <button disabled={loading} type="submit" id="button-anime">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </motion.div>
  )
};

export default ReviewForm;
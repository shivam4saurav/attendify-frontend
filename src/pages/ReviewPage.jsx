import React, { useEffect, useState } from 'react';
import '../index.css';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import ReviewForm from '../components/review/ReviewForm';
import ReviewCard from '../components/review/ReviewCard';
import { reviewsApi } from '../services/api';
import { notify } from '../utils/toast';

const ReviewPage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const { data } = await reviewsApi.getAll();
      if (data.success) {
        setAllReviews(data.data);
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to fetch reviews');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllReviews();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="reviews">
      <h1>Reviews</h1>
      <motion.div
        className="reviews-body"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        {loading ? (
          <Loader />
        ) : (
          allReviews.map((review) => (
            <ReviewCard review={review} key={review._id} />
          ))
        )}
      </motion.div>

      <ReviewForm setAllReviews={setAllReviews} />
      
    </div>
  );
};

export default ReviewPage;

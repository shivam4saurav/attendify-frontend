import React, { createContext, useState } from 'react';
import { attendanceApi } from '../services/api';
import { notify } from '../utils/toast';

export const AttendContext = createContext();

const AttendState = (props) => {
  const [subs, setSubs] = useState([]);
  const [load, setLoad] = useState(true);

  // Fetch all subjects
  const fetchSubs = async () => {
    props.setProgress(30);
    setLoad(true);

    try {
      const { data } = await attendanceApi.getAll();
      props.setProgress(70);

      if (data.success) {
        setSubs(data.data);
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to fetch subjects');
    }

    setLoad(false);
    props.setProgress(100);
  };

  // Add a new subject
  const addSub = async (subject) => {
    setLoad(true);

    try {
      const { data } = await attendanceApi.create(subject);

      if (data.success) {
        setSubs((prev) => [data.data, ...prev]);
        notify.success('Subject added');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to add subject');
    }

    setLoad(false);
  };

  // Delete existing subject
  const deleteSub = async (id) => {
    setLoad(true);

    try {
      const { data } = await attendanceApi.remove(id);

      if (data.success) {
        setSubs((prev) => prev.filter((sub) => sub._id !== id));
        notify.warning('Subject deleted');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to delete subject');
    }

    setLoad(false);
  };

  // Update the attendance of the subject
  const updateSub = async (id, subject, classesAttended, totalClasses) => {
    setLoad(true);

    try {
      const { data } = await attendanceApi.update(id, {
        subject,
        classesAttended,
        totalClasses,
      });

      if (data.success) {
        setSubs((prev) =>
          prev.map((sub) => (sub._id === id ? data.data : sub))
        );
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to update attendance');
    }

    setLoad(false);
  };

  return (
    <AttendContext.Provider value={{ load, subs, fetchSubs, addSub, deleteSub, updateSub }}>
      {props.children}
    </AttendContext.Provider>
  );
};

export default AttendState;

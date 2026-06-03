import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import SubItem from './SubItem';
import AddSub from './AddSub';
import BarGraph from './BarGraph';
import PieGraph from './PieGraph';
import { AttendContext } from '../contexts/AttendContext';
import { AuthContext } from '../contexts/AuthContext';
import NoSubjects from './NoSubjects';
import { useNavigate } from 'react-router-dom';

const Subjects = () => {
  const [goal, setGoal] = useState(
    localStorage.getItem('goal') ? parseFloat(localStorage.getItem('goal')) : 75
  );
  const { subs, fetchSubs } = useContext(AttendContext);
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      fetchSubs();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated]);

  const overallAttendance = subs.length > 0
    ? (subs.reduce((acc, curr) => acc + curr.percentage, 0) / subs.length).toFixed(2)
    : '0.00';

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="goalContainer">
        <p className="goalText">Enter your Attendance Goal: </p>
        <input
          type="text"
          placeholder={localStorage.getItem('goal') || 75}
          className="goalInput"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            e.target.value = e.target.value === '' ? 0 : e.target.value;
            e.target.value = parseFloat(e.target.value);
            setGoal(parseFloat(e.target.value));
            localStorage.setItem('goal', e.target.value);
          }}
        />
      </div>
      {(goal >= 0 && goal <= 100 && !isNaN(goal)) || (
        <p style={{ color: 'red', fontSize: '1.4rem' }}>Enter a valid percentage!</p>
      )}
      <AddSub />
      {subs.length > 0 ? (
        <div className="subJects">
          {subs.map((sub) => (
            <SubItem key={sub._id} sub={sub} goal={goal} />
          ))}
        </div>
      ) : (
        <NoSubjects />
      )}
      {subs.length > 0 && (
        <div className="analytics">
          <h2 style={{ marginTop: '40px' }}>Overall Attendance: {overallAttendance}%</h2>
          <BarGraph goal={goal} />
          <PieGraph />
        </div>
      )}
    </div>
  );
};

export default Subjects;

import React, { useContext, useRef, useState } from 'react';
import '../../index.css';
import Popup from 'reactjs-popup';
import { AttendContext } from '../../contexts/AttendContext';

const AddSub = () => {
  const { addSub } = useContext(AttendContext);

  const [sub, setSub] = useState({ subject: '' });
  const refClose = useRef(null);

  const handleChange = (event) => {
    setSub({ ...sub, [event.target.name]: event.target.value });
  };

  const addNewSub = (event) => {
    event.preventDefault();
    addSub(sub.subject);
    refClose.current.click();
    setSub({ subject: '' });
  };

  return (
    <div>
      <Popup overlayStyle={{ background: 'rgba(0, 0, 0, .5)' }} trigger={<button className="addSub"><i className="fa-regular fa-plus"></i>Add Subject</button>} modal nested>
        {(close) => (
          <div className="newSubForm">
            <div className="closebtn">
              <button onClick={() => close()} className="close"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={addNewSub} className="newSub">
              <p htmlFor="subject">New Subject</p>
              <input type="text" name="subject" placeholder="English" onChange={handleChange} />
              <div className="subBtns">
                <button ref={refClose} onClick={() => close()}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default AddSub;

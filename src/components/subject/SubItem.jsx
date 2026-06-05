import React, { useContext, useRef, useState } from 'react';
import '../../index.css';
import Popup from 'reactjs-popup';
import { AttendContext } from '../../contexts/AttendContext';
import { notify } from '../../utils/toast';

const SubItem = ({ sub, goal }) => {
  const { deleteSub, updateSub } = useContext(AttendContext);

  const [newName, setNewName] = useState('');
  const [confirmRename, setConfirmRename] = useState('none');
  const [subRename, setSubRename] = useState(false);
  const nameRef = useRef(null);
  const closeRef = useRef(null);

  // Present
  const handlePresent = () => {
    const updatedAttended = sub.classesAttended + 1;
    const updatedTotal = sub.totalClasses + 1;
    updateSub(sub._id, sub.subject, updatedAttended, updatedTotal);
  };

  // Absent
  const handleAbsent = () => {
    const updatedTotal = sub.totalClasses + 1;
    updateSub(sub._id, sub.subject, sub.classesAttended, updatedTotal);
  };

  // Renaming subject
  const handleRename = () => {
    setSubRename(!subRename);
    if (!subRename) {
      nameRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(nameRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    closeRef.current.click();
  };

  const handleNameChange = (event) => {
    setNewName(event.target.innerHTML);
    setConfirmRename('block');
  };

  const handleConfirmRename = () => {
    updateSub(sub._id, newName, sub.classesAttended, sub.totalClasses);
  };

  const handleNameBlur = () => {
    setSubRename(false);
    setTimeout(() => {
      setConfirmRename('none');
    }, 300);
    notify.info('Subject renamed');
  };

  // Reset subject attendance
  const handleSubReset = () => {
    updateSub(sub._id, sub.subject, 0, 0);
    closeRef.current.click();
    notify.warning('Subject reset');
  };

  // Delete subject
  const handleDelete = () => {
    deleteSub(sub._id);
  };

  const belowGoal = sub.percentage < goal && sub.totalClasses !== 0;
  const textColor = belowGoal ? '#e5322d' : 'rgb(24, 49, 83)';

  return (
    <>
      <div className="subItem">
        <div
          className="subName"
          style={{ color: textColor }}
          suppressContentEditableWarning={true}
          onInput={handleNameChange}
          contentEditable={subRename}
          onBlur={handleNameBlur}
          ref={nameRef}
        >
          {sub.subject}
        </div>
        <button
          className="confirmRename"
          style={{ display: confirmRename }}
          onClick={handleConfirmRename}
        >
          Rename
        </button>
        <div className="percent" style={{ color: textColor }}>
          {sub.percentage}%
        </div>
        <div className="attended" style={{ color: textColor }}>
          Attendance: <span className="present">{sub.classesAttended}/{sub.totalClasses}</span>
        </div>
        <div className="clicks">
          <button onClick={handlePresent}>Present</button>
          <button onClick={handleAbsent}>Absent</button>

          <Popup trigger={<button className="kebab"><i className="fa-solid fa-ellipsis-vertical"></i></button>}>
            {(close) => (
              <div className="options">
                <button onClick={handleRename}>Rename</button>
                <button onClick={handleSubReset}>Reset</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={() => close()} ref={closeRef} style={{ display: 'none' }}>Close</button>
              </div>
            )}
          </Popup>
        </div>
      </div>
      {belowGoal ? (
        <p className="bunk">
          Attend next <b>{Math.ceil((goal * sub.totalClasses - 100 * sub.classesAttended) / (100 - goal))}</b> classes to get back on track!
        </p>
      ) : (
        <p className="bunk">
          On track, you may leave the next <b>{Math.floor((100 * sub.classesAttended - goal * sub.totalClasses) / goal)}</b> classes! Have fun!
        </p>
      )}
    </>
  );
};

export default SubItem;

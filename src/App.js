import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import bg from './assets/bg.svg';

const lockIcon = {
  open: '0h-3v2h4a2',
  closed: '0v2h1a2',
};

const validationNames = [
  { id: 'lowercase', name: 'Lower-case' },
  { id: 'uppercase', name: 'Upper-case' },
  { id: 'number', name: 'Number' },
  { id: 'minChar', name: 'More than 8 characters' },
];

const validationObj = {
  lowercase: false,
  uppercase: false,
  number: false,
  minChar: false,
};

const validationReducer = (state, action) => {
  switch (action.type) {
    case 'lowercase':
    case 'uppercase':
    case 'number':
    case 'minChar':
      return { ...state, [action.type]: action.payload };
    default:
      return state;
  }
};

function App() {
  const [lock, setLock] = useState(lockIcon.open);
  const [isLocked, setIsLocked] = useState(false);
  const [state, dispatch] = useReducer(validationReducer, validationObj);

  const handleChange = (e) => {
    const validatePass = validate(e.target.value.trim());
    setIsLocked(validatePass);
  };

  const validate = (value) => {
    const validations = {
      lowercase: /[a-z|ç|ş|ö|ü|ı|ğ]/u.test(value),
      uppercase: /[A-Z|Ç|Ş|Ö|Ü|İ|Ğ]/u.test(value),
      number: /[0-9]/.test(value),
      minChar: value.length >= 8,
    };

    for (const [key, isValid] of Object.entries(validations)) {
      dispatch({ type: key, payload: isValid });
    }

    return Object.values(validations).every(Boolean);
  };

  useEffect(() => {
    if (isLocked) {
      const timeout = setTimeout(() => {
        setLock(lockIcon.closed);
      }, 700);
      return () => clearTimeout(timeout);
    } else {
      setLock(lockIcon.open);
    }
  }, [isLocked]);

  return (
    <div className="App" style={{ backgroundImage: `url(${bg})` }}>
      <div className="form-box">
        <ValidationItems state={state} />
        <FormField
          lock={lock}
          handleChange={handleChange}
          isLocked={isLocked}
        />
      </div>
    </div>
  );
}

const ValidationIcon = ({ isDone }) => {
  return isDone ? (
    <svg width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        className="check"
        points="1,7 5,11 13,1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2px"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6A6 6 0 110 6a6 6 0 0112 0z" fill="#5B9A78" />
    </svg>
  );
};

const ValidationItems = ({ state }) => (
  <ul className="validation-box">
    {validationNames.map((item) => (
      <li
        className={
          state[item.id] === true ? `done validation-item` : 'validation-item'
        }
        key={item.id}>
        <span className="validation-icon">
          <ValidationIcon isDone={state[item.id]} />
        </span>
        {item.name}
      </li>
    ))}
  </ul>
);

const FormField = ({ lock, handleChange, isLocked }) => {
  return (
    <div className="form-field">
      <input
        className="form-input"
        id="password"
        type="password"
        onChange={handleChange}
      />
      <label className="form-label" htmlFor="password">
        Password
      </label>
      <div className="form-input-lock">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`lock-icon ${isLocked && `locked`}`}
          width="20"
          height="20">
          <path
            d={`M4 8V6a6 6 0 1112 ${lock} 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 10-2.009-.005L9 14.73zM7 6v2h6V6a3 3 0 10-6 0z`}
          />
        </svg>
      </div>
    </div>
  );
};

export default App;

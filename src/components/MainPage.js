import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import NetworkTree from './NetworkTree';

const MainPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  return (
    <div className="main-container">
      <header>
        <h1>Welcome, {user?.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <NetworkTree />
    </div>
  );
};

export default MainPage;

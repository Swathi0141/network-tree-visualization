import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import Login from "./components/Login";
import Logout from "./components/Logout";
import ProtectedRoute from "./ProtectedRoute";
import NetworkTree from "./components/NetworkTree";
import { data } from "./data";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div>
        <header>
          <h1>Network Tree Visualization</h1>
          {user && <Logout />}
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<NetworkTree data={data} />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
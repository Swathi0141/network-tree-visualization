import React, { useState } from 'react';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  return (
    <div className="login-page">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

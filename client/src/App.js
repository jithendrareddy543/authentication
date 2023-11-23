import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({})

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password
      });

      const { token } = response.data;
      setToken(token);
      setMessage('');
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || 'Unknown error');
      setMessage('Login failed. Check the console for details.');
    }
  };

  const handleProtectedRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/protected', {
        headers: {
          Authorization: token
        }
      });

      setMessage(response.data.message);
      setUserDetails(response.data.user);
      console.log(userDetails)
    } catch (error) {
      console.error('Protected request error:', error.response?.data?.message || 'Unknown error');
      setMessage('Protected request failed. Check the console for details.');
    }
  };

  return (
    <div>
      <h1>Login Authentication</h1>
      {!message && <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>}
      {!message && <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>}
      {!token && <button onClick={handleLogin}>Login</button>}
      {token && <button onClick={handleProtectedRequest}>Make Protected Request</button>}
      {message && <p>{JSON.stringify(userDetails)}</p>}
    </div>
  );
}

export default App;
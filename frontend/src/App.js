import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/users');
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editUserId) {
      // Update user
      await axios.put(`http://localhost:3000/users/${editUserId}`, { name, email });
      setEditUserId(null);
    } else {
      // Add user
      await axios.post('http://localhost:3000/users', { name, email });
    }
    setName('');
    setEmail('');
    fetchUsers();
  };

  

  // Edit a user
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditUserId(user._id);
  };

  // Delete a user
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3000/users/${id}`);
    fetchUsers();
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{editUserId ? 'Update' : 'Add'} User</button>
      </form>
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => editUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user)}>Delete</button>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
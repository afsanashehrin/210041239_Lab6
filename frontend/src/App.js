import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the updated CSS

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please check the console for details.');
    }
  };

  // Edit a user
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditUserId(user._id);
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please check the console for details.');
    }
  };

  return (
    <div className="App">
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
      <table>
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
              <td className="actions">
                <button onClick={() => editUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
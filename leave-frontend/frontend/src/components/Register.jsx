import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', form);
      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4 text-primary">🏢 Leave Management</h3>
        <h5 className="text-center mb-3">Register</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            placeholder="Enter your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            placeholder="Enter email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          className="btn btn-success w-100 mb-3"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center mb-0">
          Already have account? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}

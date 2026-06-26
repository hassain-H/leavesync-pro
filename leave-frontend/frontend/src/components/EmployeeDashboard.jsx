import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    leaveType: 'SICK',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/leave/my', { headers });
      setLeaves(res.data);
    } catch {
      console.error('Failed to fetch leaves');
    }
  };

  const applyLeave = async () => {
    if (!form.startDate || !form.endDate || !form.reason) {
      setMessage('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/leave/apply', form, { headers });
      setMessage('✅ Leave applied successfully!');
      setForm({ leaveType: 'SICK', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch {
      setMessage('❌ Failed to apply leave');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const statusBadge = (status) => {
    const colors = { APPROVED: 'success', REJECTED: 'danger', PENDING: 'warning' };
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
  };

  return (
    <div className="container py-4">
      {/* Navbar */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-primary text-white rounded">
        <h5 className="mb-0">🏢 Leave Management System</h5>
        <div>
          <span className="me-3">👤 {name}</span>
          <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Apply Leave */}
      <div className="card shadow mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">📋 Apply for Leave</h5>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Leave Type</label>
              <select
                className="form-control"
                value={form.leaveType}
                onChange={e => setForm({ ...form, leaveType: e.target.value })}
              >
                <option value="SICK">Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="ANNUAL">Annual Leave</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Reason</label>
              <input
                className="form-control"
                placeholder="Enter reason"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
              />
            </div>
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={applyLeave}
            disabled={loading}
          >
            {loading ? 'Applying...' : '➕ Apply Leave'}
          </button>
        </div>
      </div>

      {/* Leave History */}
      <div className="card shadow">
        <div className="card-header bg-white">
          <h5 className="mb-0">📅 My Leave History</h5>
        </div>
        <div className="card-body">
          {leaves.length === 0 ? (
            <p className="text-muted text-center py-3">No leave requests yet.</p>
          ) : (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, i) => (
                  <tr key={l.id}>
                    <td>{i + 1}</td>
                    <td>{l.leaveType}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.reason}</td>
                    <td>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

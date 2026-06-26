import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/leave/admin/all', { headers });
      setLeaves(res.data);
    } catch {
      console.error('Failed to fetch');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/leave/admin/update/${id}?status=${status}`,
        {}, { headers }
      );
      fetchAll();
    } catch {
      alert('Update failed');
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

  const filtered = filter === 'ALL' ? leaves : leaves.filter(l => l.status === filter);

  const counts = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'PENDING').length,
    approved: leaves.filter(l => l.status === 'APPROVED').length,
    rejected: leaves.filter(l => l.status === 'REJECTED').length,
  };

  return (
    <div className="container py-4">
      {/* Navbar */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded">
        <h5 className="mb-0">🛡️ Admin Dashboard</h5>
        <div>
          <span className="me-3">👤 {name}</span>
          <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h2 className="text-primary">{counts.total}</h2>
              <p className="mb-0">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h2 className="text-warning">{counts.pending}</h2>
              <p className="mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h2 className="text-success">{counts.approved}</h2>
              <p className="mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-danger">
            <div className="card-body">
              <h2 className="text-danger">{counts.rejected}</h2>
              <p className="mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card shadow">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📋 All Leave Requests</h5>
          <div>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
              <button
                key={f}
                className={`btn btn-sm me-1 ${filter === f ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {filtered.length === 0 ? (
            <p className="text-muted text-center py-3">No requests found.</p>
          ) : (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id}>
                    <td>{i + 1}</td>
                    <td>{l.user?.name}</td>
                    <td>{l.leaveType}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.reason}</td>
                    <td>{statusBadge(l.status)}</td>
                    <td>
                      {l.status === 'PENDING' && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => updateStatus(l.id, 'APPROVED')}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => updateStatus(l.id, 'REJECTED')}
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                    </td>
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

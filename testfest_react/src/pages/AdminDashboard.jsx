import { useState, useEffect } from 'react';
import '../assets/styles/admin-dashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('testfest_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('testfest_users', JSON.stringify(users));
    }
  }, [users]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Navn er påkrevd';
    }

    if (!formData.id.trim()) {
      newErrors.id = 'Bruker-ID er påkrevd';
    } else if (!editingUser && users.some(user => user.id === formData.id)) {
      newErrors.id = 'Denne bruker-ID finnes allerede';
    }

    if (!editingUser && !formData.password) {
      newErrors.password = 'Passord er påkrevd';
    }

    if (!editingUser && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passordene matcher ikke';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Passord må være minst 6 tegn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(true);
    setFormData({
      id: user.id,
      name: user.name,
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Er du sikker på at du vil slette denne brukeren?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              name: formData.name,
              ...(formData.password ? { password: formData.password } : {})
            }
          : user
      ));
    } else {
      // Add new user
      const newUser = {
        id: formData.id,
        name: formData.name,
        password: formData.password,
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
    }

    // Reset form
    setIsAddingUser(false);
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAddingUser(false);
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="container main-content">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Administrer brukere med tilgang til å opprette Testfester</p>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <div className="section-header">
              <h2>Brukeroversikt</h2>
              <button 
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={isAddingUser}
              >
                + Opprett ny bruker
              </button>
            </div>

            {isAddingUser && (
              <div className="user-form-container">
                <h3>{editingUser ? 'Rediger bruker' : 'Opprett ny bruker'}</h3>
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      Navn <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Skriv inn brukerens fulle navn"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="id">
                      Bruker-ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className={errors.id ? 'error' : ''}
                      placeholder="Skriv inn bruker-ID (unik identifikator)"
                      disabled={!!editingUser}
                    />
                    {errors.id && <span className="error-message">{errors.id}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      Passord {editingUser && '(La stå tom for å beholde eksisterende)'}
                      {!editingUser && <span className="required">*</span>}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? 'error' : ''}
                      placeholder="Minimum 6 tegn"
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  {!editingUser && (
                    <div className="form-group">
                      <label htmlFor="confirmPassword">
                        Bekreft passord <span className="required">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'error' : ''}
                        placeholder="Skriv inn passord på nytt"
                      />
                      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingUser ? 'Lagre endringer' : 'Opprett bruker'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Avbryt
                    </button>
                  </div>
                </form>
              </div>
            )}

            {users.length === 0 ? (
              <div className="empty-state">
                <p>Ingen brukere opprettet ennå.</p>
                <p>Klikk på "Opprett ny bruker" for å komme i gang.</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Navn</th>
                      <th>Bruker-ID</th>
                      <th>Opprettet</th>
                      <th>Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td data-label="Navn">{user.name}</td>
                        <td data-label="Bruker-ID">{user.id}</td>
                        <td data-label="Opprettet">
                          {new Date(user.createdAt).toLocaleDateString('nb-NO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td data-label="Handlinger">
                          <div className="action-buttons">
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditUser(user)}
                              aria-label={`Rediger ${user.name}`}
                            >
                              Rediger
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeleteUser(user.id)}
                              aria-label={`Slett ${user.name}`}
                            >
                              Slett
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-info">
            <div className="info-card">
              <h3>Statistikk</h3>
              <div className="stat-item">
                <span className="stat-label">Totalt antall brukere:</span>
                <span className="stat-value">{users.length}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Informasjon</h3>
              <p>Som superbruker har du full kontroll over alle brukerkontoer.</p>
              <ul>
                <li>Opprett nye brukere som skal kunne opprette Testfester</li>
                <li>Rediger eksisterende brukere</li>
                <li>Slett brukere som ikke lenger skal ha tilgang</li>
              </ul>
            </div>

            <div className="info-card warning">
              <h3>Viktig</h3>
              <p>Vær forsiktig når du sletter brukere. Denne handlingen kan ikke angres.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import '../assets/styles/admin-dashboard.css';
import { getUsers, createUser, updateUser, deleteUser } from '../services/brukerService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Last brukere fra API ved komponentmontering
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setApiError('');
    } catch (error) {
      setApiError('Kunne ikke laste brukere. Prøv igjen senere.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Navn er påkrevd';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Brukernavn er påkrevd';
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
    // Fjern feil for dette feltet når bruker begynner å skrive
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(true);
    setFormData({
      username: user.Brukernavn,
      name: user.Navn,
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Er du sikker på at du vil slette ${userName}?`)) {
      try {
        setLoading(true);
        await deleteUser(userId);
        await fetchUsers(); // Oppdater liste
        setApiError('');
      } catch (error) {
        setApiError(error.message || 'Kunne ikke slette bruker');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setApiError('');

      if (editingUser) {
        // Oppdater eksisterende bruker
        const updateData = {
          name: formData.name,
          ...(formData.password ? { password: formData.password } : {})
        };
        await updateUser(editingUser.BrukerID, updateData);
      } else {
        // Legg til ny bruker
        const newUserData = {
          username: formData.username,
          name: formData.name,
          password: formData.password,
          isSuperUser: false
        };
        await createUser(newUserData);
      }

      // Oppdater brukerliste
      await fetchUsers();

      // Tilbakestill skjema
      setIsAddingUser(false);
      setEditingUser(null);
      setFormData({
        username: '',
        name: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      setApiError(error.message || 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingUser(false);
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setApiError('');
  };

  return (
    <div className="container main-content">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Administrer brukere med tilgang til å opprette Testfester</p>
        </div>

        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <div className="admin-content">
          <div className="admin-section">
            <div className="section-header">
              <h2>Brukeroversikt</h2>
              <button 
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={isAddingUser || loading}
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
                      disabled={loading}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">
                      Brukernavn <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? 'error' : ''}
                      placeholder="Skriv inn brukernavn (unik identifikator)"
                      disabled={!!editingUser || loading}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
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
                      disabled={loading}
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
                        disabled={loading}
                      />
                      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Lagrer...' : (editingUser ? 'Lagre endringer' : 'Opprett bruker')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                      Avbryt
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && users.length === 0 ? (
              <div className="loading-state">
                <p>Laster brukere...</p>
              </div>
            ) : users.length === 0 ? (
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
                      <th>Brukernavn</th>
                      <th>Type</th>
                      <th>Opprettet</th>
                      <th>Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.BrukerID}>
                        <td data-label="Navn">{user.Navn}</td>
                        <td data-label="Brukernavn">{user.Brukernavn}</td>
                        <td data-label="Type">
                          {user.ErSuperbruker ? (
                            <span className="badge badge-admin">Admin</span>
                          ) : (
                            <span className="badge badge-user">Bruker</span>
                          )}
                        </td>
                        <td data-label="Opprettet">
                          {new Date(user.Opprettet).toLocaleDateString('nb-NO', {
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
                              disabled={loading}
                              aria-label={`Rediger ${user.Navn}`}
                            >
                              Rediger
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeleteUser(user.BrukerID, user.Navn)}
                              disabled={loading}
                              aria-label={`Slett ${user.Navn}`}
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
              <div className="stat-item">
                <span className="stat-label">Administratorer:</span>
                <span className="stat-value">
                  {users.filter(u => u.ErSuperbruker).length}
                </span>
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
              <p>Du kan ikke slette den siste administratoren.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
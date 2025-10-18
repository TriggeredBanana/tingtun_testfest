import { useState, useEffect } from 'react';
import '../assets/styles/admin-dashboard.css';
import { getUsers, createUser, updateUser, deleteUser } from '../services/brukerService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brukernavn: '',
    navn: '',
    passord: '',
    bekreftPassord: ''
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

    if (!formData.navn.trim()) {
      newErrors.navn = 'Navn er påkrevd';
    }

    if (!formData.brukernavn.trim()) {
      newErrors.brukernavn = 'Brukernavn er påkrevd';
    }

    if (!editingUser && !formData.passord) {
      newErrors.passord = 'Passord er påkrevd';
    }

    if (!editingUser && formData.passord !== formData.bekreftPassord) {
      newErrors.bekreftPassord = 'Passordene matcher ikke';
    }

    if (formData.passord && formData.passord.length < 6) {
      newErrors.passord = 'Passord må være minst 6 tegn';
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
      brukernavn: '',
      navn: '',
      passord: '',
      bekreftPassord: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(true);
    setFormData({
      brukernavn: user.Brukernavn,
      navn: user.Navn,
      passord: '',
      bekreftPassord: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleDeleteUser = async (brukerId, brukerNavn) => {
    if (window.confirm(`Er du sikker på at du vil slette ${brukerNavn}?`)) {
      try {
        setLoading(true);
        await deleteUser(brukerId);
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
          navn: formData.navn,
          ...(formData.passord ? { passord: formData.passord } : {})
        };
        await updateUser(editingUser.BrukerID, updateData);
      } else {
        // Legg til ny bruker
        const newUserData = {
          brukernavn: formData.brukernavn,
          navn: formData.navn,
          passord: formData.passord,
          erSuperbruker: false
        };
        await createUser(newUserData);
      }

      // Oppdater brukerliste
      await fetchUsers();

      // Tilbakestill skjema
      setIsAddingUser(false);
      setEditingUser(null);
      setFormData({
        brukernavn: '',
        navn: '',
        passord: '',
        bekreftPassord: ''
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
      brukernavn: '',
      navn: '',
      passord: '',
      bekreftPassord: ''
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
                    <label htmlFor="navn">
                      Navn <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="navn"
                      name="navn"
                      value={formData.navn}
                      onChange={handleInputChange}
                      className={errors.navn ? 'error' : ''}
                      placeholder="Skriv inn brukerens fulle navn"
                      disabled={loading}
                    />
                    {errors.navn && <span className="error-message">{errors.navn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="brukernavn">
                      Brukernavn <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="brukernavn"
                      name="brukernavn"
                      value={formData.brukernavn}
                      onChange={handleInputChange}
                      className={errors.brukernavn ? 'error' : ''}
                      placeholder="Skriv inn brukernavn (unik identifikator)"
                      disabled={!!editingUser || loading}
                    />
                    {errors.brukernavn && <span className="error-message">{errors.brukernavn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="passord">
                      Passord {editingUser && '(La stå tom for å beholde eksisterende)'}
                      {!editingUser && <span className="required">*</span>}
                    </label>
                    <input
                      type="password"
                      id="passord"
                      name="passord"
                      value={formData.passord}
                      onChange={handleInputChange}
                      className={errors.passord ? 'error' : ''}
                      placeholder="Minimum 6 tegn"
                      disabled={loading}
                    />
                    {errors.passord && <span className="error-message">{errors.passord}</span>}
                  </div>

                  {!editingUser && (
                    <div className="form-group">
                      <label htmlFor="bekreftPassord">
                        Bekreft passord <span className="required">*</span>
                      </label>
                      <input
                        type="password"
                        id="bekreftPassord"
                        name="bekreftPassord"
                        value={formData.bekreftPassord}
                        onChange={handleInputChange}
                        className={errors.bekreftPassord ? 'error' : ''}
                        placeholder="Skriv inn passord på nytt"
                        disabled={loading}
                      />
                      {errors.bekreftPassord && <span className="error-message">{errors.bekreftPassord}</span>}
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
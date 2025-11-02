import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/styles/admin-dashboard.css';
import { getUsers, createUser, updateUser, deleteUser } from '../services/brukerService';

const AdminDashboard = () => {
  const { t } = useTranslation();
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
      setApiError(t('admin.load_error'));
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.navn.trim()) {
      newErrors.navn = t('admin.validation.name_required');
    }

    if (!formData.brukernavn.trim()) {
      newErrors.brukernavn = t('admin.validation.username_required');
    }

    if (!editingUser && !formData.passord) {
      newErrors.passord = t('admin.validation.password_required');
    }

    if (!editingUser && formData.passord !== formData.bekreftPassord) {
      newErrors.bekreftPassord = t('admin.validation.password_mismatch');
    }

    if (formData.passord && formData.passord.length < 6) {
      newErrors.passord = t('admin.validation.password_min');
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
    if (window.confirm(t('admin.confirm_delete', { name: brukerNavn }))) {
      try {
        setLoading(true);
        await deleteUser(brukerId);
        await fetchUsers(); // Oppdater liste
        setApiError('');
      } catch (error) {
        setApiError(error.message || t('admin.delete_error'));
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
      setApiError(error.message || t('admin.generic_error'));
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
          <h1>{t('admin.title')}</h1>
          <p className="admin-subtitle">{t('admin.subtitle')}</p>
        </div>

        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <div className="admin-content">
          <div className="admin-section">
            <div className="section-header">
              <h2>{t('admin.user_overview')}</h2>
              <button 
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={isAddingUser || loading}
              >
                {t('admin.add_new_user')}
              </button>
            </div>

            {isAddingUser && (
              <div className="user-form-container">
                <h3>{editingUser ? t('admin.edit_user') : t('admin.create_user')}</h3>
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="form-group">
                    <label htmlFor="navn">
                      {t('admin.form.name_label')} <span className="required">{t('admin.form.required_mark')}</span>
                    </label>
                    <input
                      type="text"
                      id="navn"
                      name="navn"
                      value={formData.navn}
                      onChange={handleInputChange}
                      className={errors.navn ? 'error' : ''}
                      placeholder={t('admin.form.name_placeholder')}
                      disabled={loading}
                    />
                    {errors.navn && <span className="error-message">{errors.navn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="brukernavn">
                      {t('admin.form.username_label')} <span className="required">{t('admin.form.required_mark')}</span>
                    </label>
                    <input
                      type="text"
                      id="brukernavn"
                      name="brukernavn"
                      value={formData.brukernavn}
                      onChange={handleInputChange}
                      className={errors.brukernavn ? 'error' : ''}
                      placeholder={t('admin.form.username_placeholder')}
                      disabled={!!editingUser || loading}
                    />
                    {errors.brukernavn && <span className="error-message">{errors.brukernavn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="passord">
                      {t('admin.form.password_label')} {editingUser && t('admin.form.password_keep_note')}
                      {!editingUser && <span className="required">{t('admin.form.required_mark')}</span>}
                    </label>
                    <input
                      type="password"
                      id="passord"
                      name="passord"
                      value={formData.passord}
                      onChange={handleInputChange}
                      className={errors.passord ? 'error' : ''}
                      placeholder={t('admin.form.password_placeholder')}
                      disabled={loading}
                    />
                    {errors.passord && <span className="error-message">{errors.passord}</span>}
                  </div>

                  {!editingUser && (
                    <div className="form-group">
                      <label htmlFor="bekreftPassord">
                        {t('admin.form.confirm_password_label')} <span className="required">{t('admin.form.required_mark')}</span>
                      </label>
                      <input
                        type="password"
                        id="bekreftPassord"
                        name="bekreftPassord"
                        value={formData.bekreftPassord}
                        onChange={handleInputChange}
                        className={errors.bekreftPassord ? 'error' : ''}
                        placeholder={t('admin.form.confirm_password_placeholder')}
                        disabled={loading}
                      />
                      {errors.bekreftPassord && <span className="error-message">{errors.bekreftPassord}</span>}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? t('admin.form.save_loading') : (editingUser ? t('admin.form.save_changes') : t('admin.form.save_create'))}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                      {t('admin.form.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && users.length === 0 ? (
              <div className="loading-state">
                <p>{t('admin.loading_users')}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <p>{t('admin.empty.no_users')}</p>
                <p>{t('admin.empty.cta')}</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>{t('admin.table.name')}</th>
                      <th>{t('admin.table.username')}</th>
                      <th>{t('admin.table.type')}</th>
                      <th>{t('admin.table.created')}</th>
                      <th>{t('admin.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.BrukerID}>
                        <td data-label={t('admin.table.name')}>{user.Navn}</td>
                        <td data-label={t('admin.table.username')}>{user.Brukernavn}</td>
                        <td data-label={t('admin.table.type')}>
                          {user.ErSuperbruker ? (
                            <span className="badge badge-admin">{t('admin.table.badge_admin')}</span>
                          ) : (
                            <span className="badge badge-user">{t('admin.table.badge_user')}</span>
                          )}
                        </td>
                        <td data-label={t('admin.table.created')}>
                          {new Date(user.Opprettet).toLocaleDateString('nb-NO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td data-label={t('admin.table.actions')}>
                          <div className="action-buttons">
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditUser(user)}
                              disabled={loading}
                              aria-label={t('admin.table.aria_edit', { name: user.Navn })}
                            >
                              {t('admin.table.edit')}
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeleteUser(user.BrukerID, user.Navn)}
                              disabled={loading}
                              aria-label={t('admin.table.aria_delete', { name: user.Navn })}
                            >
                              {t('admin.table.delete')}
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
              <h3>{t('admin.stats.title')}</h3>
              <div className="stat-item">
                <span className="stat-label">{t('admin.stats.total_users')}</span>
                <span className="stat-value">{users.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('admin.stats.admins')}</span>
                <span className="stat-value">
                  {users.filter(u => u.ErSuperbruker).length}
                </span>
              </div>
            </div>

            <div className="info-card">
              <h3>{t('admin.info.title')}</h3>
              <p>{t('admin.info.p1')}</p>
              <ul>
                <li>{t('admin.info.li1')}</li>
                <li>{t('admin.info.li2')}</li>
                <li>{t('admin.info.li3')}</li>
              </ul>
            </div>

            <div className="info-card warning">
              <h3>{t('admin.warning.title')}</h3>
              <p>{t('admin.warning.p1')}</p>
              <p>{t('admin.warning.p2')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
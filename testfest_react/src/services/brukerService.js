const API_URL = 'http://localhost:8800/brukere';

// Hent alle brukere
export const getUsers = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Kunne ikke hente brukere');
    }
    return await response.json();
  } catch (error) {
    console.error('Feil ved henting av brukere:', error);
    throw error;
  }
};

// Opprett ny bruker
export const createUser = async (brukerData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brukerData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke opprette bruker');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved oppretting av bruker:', error);
    throw error;
  }
};

// Oppdater bruker
export const updateUser = async (brukerId, brukerData) => {
  try {
    const response = await fetch(`${API_URL}/${brukerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brukerData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke oppdatere bruker');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved oppdatering av bruker:', error);
    throw error;
  }
};

// Slett bruker
export const deleteUser = async (brukerId) => {
  try {
    const response = await fetch(`${API_URL}/${brukerId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke slette bruker');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved sletting av bruker:', error);
    throw error;
  }
};

// Login
export const loginUser = async (brukernavn, passord) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brukernavn, passord }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login feilet');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved login:', error);
    throw error;
  }
};
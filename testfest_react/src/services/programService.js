const API_URL = 'http://localhost:8800/program';

// Hent alle programmer
export const getProgram = async () => {
  try {
    const response = await fetch(API_URL, {
      credentials: 'include' 
    });
    if (!response.ok) {
      throw new Error('Kunne ikke hente programmer');
    }
    return await response.json();
  } catch (error) {
    console.error('Feil ved henting av programmer:', error);
    throw error;
  }
};

// Opprett nytt program
export const addProgram = async (programData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });
    
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Server svarte ikke med JSON:", text);
      throw new Error("Ugyldig svar fra serveren");
    }

    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke opprette program');
    }

    return data;
  } catch (error) {
    console.error('Feil ved oppretting av program:', error);
    throw error;
  }
};

// Oppdater program
export const updateProgram = async (ProgramID, programData) => {
  try {
    const response = await fetch(`${API_URL}/${ProgramID}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke oppdatere program');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved oppdatering av program:', error);
    throw error;
  }
};

// Slett program
export const deleteProgram = async (ProgramID) => {
  try {
    const response = await fetch(`${API_URL}/${ProgramID}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Kunne ikke slette program');
    }
    
    return data;
  } catch (error) {
    console.error('Feil ved sletting av program:', error);
    throw error;
  }
};
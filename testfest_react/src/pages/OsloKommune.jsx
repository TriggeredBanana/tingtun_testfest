import '../assets/styles/testfest-pages.css';

const OsloKommune = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
                <div className="testfest-header">
                    <h1>Testfest 3. September - Oslo kommune</h1>
                    <p>Fint om du kan 'tenke høyt' mens du tester for å vise hvordan tjenesten fungerer (eller ikke).</p>
                    <p>Send gjerne skriftlig tilbakemelding fra lenken under hver oppgave.</p>
                </div>
  
                <div className="task-grid">
                    <div class="task-item">
                        <h2>Oppgave 1: Kontakt hjemmetjenesten</h2>
                        <p>Du har behov for å sende en melding til hjemmetjenesten der du bor. Finn ut hvordan du kan sende og motta meldinger til hjemmetjenesten.</p>
                    </div>
  
                    <div className="task-item">
                        <h2>Oppgave 2: Hvor lenge varer juleferien i skolen?</h2>
                        <p>Du planlegger å reise utenlands med familien i nyttårshelgen. Prøv å finne ut når skolen starter opp igjen etter juleferien.</p>
                    </div>
  
                    <div className="task-item">
                        <h2>Oppgave 3: Hvor kan jeg svømme, og hva koster det?</h2>
                        <p>Du ønsker å bade i en svømmehall i Oslo i ettermiddag klokka 17:30. Hvordan vil du gå fram for å finne ut hvor du kan dra, når det stenger og hvor mye det koster?</p>
                    </div>

                    <div className="task-item">
                        <h2>Oppgave 4: Hvorfor er det forbud mot mobiltelefoner i Osloskolen?</h2>
                        <p>Du har fått beskjed fra din sønn/datter at det plutselig er forbudt å bruke mobiltelefon i skoletiden. Klarer du å finne en nyhetssak om dette på kommunenes nettsider?</p>
                    </div>
                </div>
            </div>
		
            <div className="side">
                <div class="program-schedule">
                    <h3>Oslo kommune og UiO<br/>Punkter for kveldens program:</h3>
                    <ul>
                        <li>Velkommen – Pizza er servert (Christian)</li>
                        <li>Introduksjon til Testfest (Mikael og Joschua)</li>
                        <li>Vi setter igang med testene</li>
                        <li>Pause med påfyll</li>
                        <li>Videre testing og deling av erfaringer</li>
                        <li>Avslutning og oppsummering (Alle)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default OsloKommune;
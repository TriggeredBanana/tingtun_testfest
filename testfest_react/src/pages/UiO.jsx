import '../assets/styles/testfest-pages.css';

const UiO = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <div class="testfest-header">
                    <h1>Testfest 1. oktober - UiO</h1>
                    <p>Fint om du kan 'tenke høyt' mens du tester for å vise hvordan tjenesten fungerer (eller ikke).</p>
                </div>
                
                <div class="uio-link">
                    <p>Oppgavene under tar utgangspunkt i tjenesten "Mine studier" du finner på <a href="https://minestudier.uio.no/nb/student?demo=5">Mine studier.</a></p>
                </div>
  
                <div class="task-grid">
                    <div class="task-item academic-task">
                        <h2>Oppgave 1: Navigering i timeplan</h2>
                        <p>1. Du har en venn som lurer på om dere kan finne på noe førstkommende fredag kl. 13:00. Du er usikker på om det krasjer med forelesningene dine og tar opp Mine studier for å sjekke timeplanen.</p>
                        <div class="sub-tasks">
                            <p>a. Kan du finne ut om du har forelesning kl 13.00?</p>
                            <p>b. Du lurer på om du har forelesning onsdag neste uke, kan du sjekke det?</p>
                            <p>c. Finner du ut hvor denne forelesningen skal være?</p>
                        </div>
                    </div>
  
                    <div class="task-item academic-task">
                        <h2>Oppgave 2: Beskjeder</h2>
                        <p>1. Du liker å holde deg oppdatert på beskjedene du får som student og ser at du har to uleste beskjeder i Mine studier.</p>
                        <div class="sub-tasks">
                            <p>a. Hvilke beskjeder er det?</p>
                            <p>b. For de med skjermleser; Basert på det som skjermleseren leste opp, synes du det er vanskelig å forstå hvilke beskjeder som er ulest?</p>
                            <p>c. Burde det vært gjort på noen annen måte?</p>
                        </div>
                        <p>2. Den 13.mai mottok du en beskjed om en spørreundersøkelse som du har glemt å svare på</p>
                        <div class="sub-tasks">
                            <p>a. Kan du finne tilbake til den?</p>
                            <p>b. Finner du en spørreundersøkelse i beskjeden?</p>
                        </div>
                    </div>
  
                    <div class="task-item academic-task">
                        <h2>Oppgave 3: Sjekkliste</h2>
                        <p>1. I Mine studier har du en sjekkliste med ting du må huske å gjøre som ny student. Du har fått beskjed om at du må huske å registrere deg i Studentweb, men er usikker på om du har gjort det.</p>
                        <div class="sub-tasks">
                            <p>a. Kan du sjekke om du har registrert deg i Studentweb?</p>
                        </div>
                        <p>2. Du kommer på at du må betale semesteravgiften, men er usikker på hvordan du skal betale</p>
                        <div class="sub-tasks">
                            <p>a. Finner du noe info om det i sjekklisten?</p>
                            <p>b. Med infoen du får i sjekkpunktet, hvordan ville du gått frem for å betale?</p>
                        </div>
                        <p>3. Du lurer på når fristen for å betale semesteravgiften er.</p>
                        <div class="sub-tasks">
                            <p>a. Finner du noe info om det i sjekklisten i Mine studier?</p>
                            <p>b. Med infoen du får i sjekkpunktet, hvordan ville du gått frem for å betale?</p>
                        </div>
                    </div>

                    <div class="task-item extra-tasks">
                        <h2>Ekstra Oppgaver</h2>
                        <p>1. <b>Sjekkliste:</b> Du har gjennomført alle punktene i sjekklisten, og ønsker å fjerne den. Finner du noe sted i sjekklisten hvor du kan fjerne den?</p>
                        <p>2. <b>Beskjeder:</b> Du ønsker å kun se beskjeder sendt på et emne, med emnekoden MAT1110. Kan du sette det som et filter for beskjedene?</p>
                    </div>
                </div>
            </div>
		
            <div class="side">
                <div class="program-schedule">
                    <h3>Oslo kommune og UiO<br/>Punkter for kveldens program:</h3>
                    <ul>
                        <li>Velkommen – Pizza er servert (Eva Elida)</li>
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

export default UiO;
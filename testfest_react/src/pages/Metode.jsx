import '../assets/styles/metode.css';
import deltakereImg from '../assets/images/deltakere.jpg';

const Metode = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <h1>Testfest metode</h1>
          
          <div className="method-intro">
            <p>Viktig å huske at det er tjenestene som blir testet. Det er ikke en eksamen for testerne (brukerne). Testernes fremgangsmåter og kompetanse kan hjelpe til med å avdekke barrierer og til å utforme forbedringer.</p>
            <p>Et mål med Testfesten er å finne en god balanse mellom nyttig testing og sosialt samvær, hvor testere og brukere kan bli kjent med hverandre. Vi vil legge opp til å dele erfaringer mellom testere og tjenesteeiere i løpet av kvelden. Testere er ofte motivert av at deres innspill blir brukt til faktiske forbedringer. Flott om dere kan bli enige om forbedringer og gjerne en tidsramme for gjennomføring av utbedringer.</p>
          </div>

          <div className="role-section service-owner">
            <div className="checklist-section">
              <h2>Huskeliste for tjenesteeiere</h2>
              <p>Som ekspert på den egne tjenesten er det ofte fristende å hjelpe andre å bruke den. Dette kan påvirke testerne og deres gjennomføring av testen, og føre til at viktige barrierer ikke blir avdekket eller mulige forbedringer ikke blir oppdaget. Testeren kan formidle førsteinntrykket av tjenesten.</p>
              <p>Følgende punkter er foreslått for rollen som tjenesteeier:</p>
              <ol>
                <li>
                  <b>Observer</b>
                  <p>Gi testeren litt tid til å utforske tjenesten og beskrive inntrykk og steg mot løsning av oppgaven.</p>
                </li>
                <li>
                  <b>Spør</b>
                  <p>Spør gjerne for å forstå hvordan testeren oppfatter tjenesten. For eksempel:</p>
                  <ul>
                    <li>Kan du fortelle om hvordan du vil gå frem for å løse oppgaven?</li>
                    <li>Hva tenker du når du gjør/ser dette?</li>
                    <li>Kan du foreslå en enklere utforming for denne funksjonen?</li>
                    <li>Hva ville du forvente om du velger dette menyvalget?</li>
                  </ul>
                </li>
                <li>
                  <b>Hjelp bare om nødvendig</b>
                  <p>Tilby hjelp bare når det er nødvendig eller om testeren ber om det.</p>
                </li>
                <li>
                  <b>Diskuter</b>
                  <p>Diskuter gjerne forslag til forbedringer med testeren.</p>
                </li>
              </ol>
            </div>
          </div>

          <div className="role-section tester">
            <div className="checklist-section">
              <h2>Huskeliste for testere</h2>
              <p>Det vil være til stor hjelp for tjenesteeieren om du kan "tenke høyt" mens du bruker tjenesten for å løse oppgavene. Tjenesteeierne deltar på Testfesten for å få innsikter til å forbedre sine tjenester. For å kunne fjerne feil trenger utviklere en beskrivelse for å kunne gjenskape dem.</p>
              <p>Følgende punkter er foreslått for rollen som tester:</p>
              <ol>
                <li>
                  <b>Del skjermleser</b>
                  <p>Om du bruker skjermleser, la tjenesteeieren lytte med til den.</p>
                </li>
                <li>
                  <b>Tenk høyt</b>
                  <p>Fortell hvordan du oppfatter tjenesten. For eksempel:</p>
                  <ul>
                    <li>Hvordan har du tenkt å løse oppgaven - før du setter i gang.</li>
                    <li>Hva forventer du ved ulike valg du tar for å finne frem og bruke tjenesten.</li>
                    <li>Beskriv uventede resultater.</li>
                  </ul>
                  <p>Beskriv hva som ikke funker, og gjerne hvorfor.</p>
                </li>
                <li>
                  <b>Spør om hjelp om nødvendig</b>
                  <p>Spør om hjelp om det er noe som ikke funker etter flere forsøk.</p>
                </li>
                <li>
                  <b>Foreslå</b>
                  <p>Foreslå gjerne forbedringer for tjenesteeieren.</p>
                </li>
              </ol>
            </div>
          </div>
        </div> 
        
        <div className="side">
          <div className="intro-image">
            <img src={deltakereImg} alt="Deltakere fra Testfest" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metode;
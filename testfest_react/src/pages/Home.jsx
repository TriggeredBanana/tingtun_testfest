import deltakereImg from '../assets/images/deltakere.jpg';
import '../assets/styles/styles.css';

const Home = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
        <div className="welcome-section">
          <h1>Velkommen til TestFest</h1>
          <p>Målet med Testfestene er å komme sammen i en trivelig ramme for å finne, forstå og fjerne feil på nettsider. Til Testfestene kommer nettstedseiere og mennesker med funksjonsnedsettelse for å teste utvalgte tjenester på ulike måter. Aktuelle verktøy kan være ulike PCer, mobiler, leselister, skjermlesere, skjermforstørrelsesprogramvare og øyesporingsutstyr. Testfestene har allerede bidratt til at Arbeidstilsynet, Oslo kommune, NHN, og Storebrand har funnet og fjernet flere feil. For å legge tilrette for videre bruk av forskningsresultatene etter endt prosjekt, vil vi publisere metode og programvare under en åpen lisens.</p>
          <p>I 2024 gjennomførte vi fem Testfester, fire i Oslo og en i Trondheim.</p>
            <p>
              Foreløpige resultater og steg videre er presentert i en video fra{" "}
              <a href="https://navikt.github.io/mangfold-i-mai/events/testfest.html" target="_blank" rel="noopener noreferrer">
                Mangfold i Mai 2024
              </a>.
            </p>
            <p>
              Ingeborg Fauske Ekdahl fra UiO har presentert erfaringer som tjenesteeier for mulig spredning av Testfest. Tanya Kovtun fra Access Lab i Ukraina har{" "}
              <a href="https://www.linkedin.com/posts/tanyakovtun_last-week-i-had-the-opportunity-to-learn-activity-7267177431495557120-5xAE" target="_blank" rel="noopener noreferrer">
                oppsummert inntrykk
              </a>{" "}
              fra et møte med UiO i tilknytning til{" "}
              <a href="https://ud2024.no/" target="_blank" rel="noopener noreferrer">
                UD2024
              </a>.
            </p>
          </div>

        <div className="highlight-box">
            <h4>Bli med du også</h4>
            <p>Prosjektet som ble gjennomført med støtte fra Barn Ungdoms og familiedirektoratet er nå avsluttet. Vi har fått flere spørsmål om videre Testfester i 2025 og kommer tilbake til en dato så snart som mulig.</p> 
        </div>

        <div className="contact-info">
            <h2>Kontakt oss gjerne</h2>
            <p>Telefon: 918 62 892</p>
            <p>E-post: contact@tingtun.no</p>
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

export default Home;
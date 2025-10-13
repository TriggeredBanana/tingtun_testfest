# Admin Dashboard - Viktige punkter og ting som må/bør gjøres siden dette er en demo

## Datalagring (nåværende)

- **Brukerdata** lagres i `localStorage` under nøkkelen `testfest_users`
- **Autentiseringsstatus** lagres i `localStorage` under nøklene:
  - `testfest_auth` (autentiseringsstatus)
  - `testfest_superuser` (superbrukerstatus)

### Viktige punkter:
Dette er en klientside-implementasjon for utvikling/demo
For produksjonsbruk, bør vi implementere noe som:
  - Backend-API for brukeradministrasjon
  - Sikker passord-hashing (bcrypt)
  - JWT eller sesjonsbasert autentisering
  - Databaselagring for brukerdata
  - HTTPS-kryptering

<br>

## Sikkerhetshensyn

### Nåværende implementasjon:
- Klientside-autentisering
- Klartekst passordlagring
- localStorage for datalagring

### For produksjon:
1. **Backend-integrasjon:**
   - Flytt autentisering til backend-server
   - Bruk sikre endepunkter
   - Implementer hastighetsbegrensning (Om vi får tid og ser det nødvendig)

2. **Passordsikkerhet:**
   - Hash passord med bcrypt eller Argon2
   - Implementer krav til passordstyrke (??)

3. **Sesjonsadministrasjon:**
   - Bruk JWT-tokens eller sikre sesjoner
   - Legg til sesjon timeout (?)

4. **Databeskyttelse:**
   - Lagre data i databasen vi har fått tildelt
   - Bruk HTTPS for all kommunikasjon
   - Implementer CSRF-beskyttelse (?)

<br><br>
## Fremtidige forbedringer

Potensielle forbedringer for admin dashboard i senere tid (tror ikke vi rekker dette på gjenværende tid):

1. **Brukerroller og tillatelser:**
   - Definer forskjellige brukerroller
   - Detaljert tillatelsessystem

2. **Avanserte funksjoner:**
   - Brukersøk og filtrering
   - Masseoperasjoner på brukere
   - Eksporter brukerdata (CSV/Excel)
   - Brukeraktivitetslogger

3. **Forbedret sikkerhet:**
   - Tofaktorautentisering (2FA)
   - Funksjonalitet for tilbakestilling av passord
   - Kontosperring etter mislykkede forsøk
   - E-postverifisering

4. **Forbedret brukeropplevelse:**
   - Paginering for store brukerlister
   - Sortering etter kolonner
   - Brukerprofiler og profilbilder (for personalisering?)
   - Tidspunkt for siste pålogging / endring

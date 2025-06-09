## **Case Study – LIA-projekt: Visualisering av väder och elproduktion/konsumtion i förnybar energi**

### **Bakgrund och syfte**

Projektet syftar till att utveckla en webbaserad applikation för att visualisera och analysera sambandet mellan väderprognoser och elproduktion/konsumtion inom den förnybara energimarknaden. Genom en tydlig och interaktiv användargränssnitt ska både historiska och prognostiserade data presenteras på ett sätt som underlättar förståelse för energiflöden och väderpåverkan.

### **Projektmål (MVP)**

Målet är att leverera en fungerande **Minimum Viable Product** med följande huvudfunktioner:

- En **dashboard** med tydlig översikt av väderdata, elproduktion och konsumtion.
- En **karta (map view)** med nätområdesindelning och väderdata per område.
- Från varje datapunkt/nod ska användaren kunna generera grafer för att jämföra **prognos vs faktisk data**.
- En **backend-for-frontend (BFF)** byggd i C# .NET som kommunicerar med externa datakällor, hanterar inloggning och servar frontend med relevant data.

---

### **Huvudsakliga arbetsmoment (Use Cases / Epics)**

### **1. Användargränssnitt (Frontend)**

- Implementera dashboard med dynamiska widgets
- Bygga kartkomponent med nätområdesindelning
- Skapa interaktiva grafer (prognos vs verklighet)
- Implementera användarflöden (t.ex. val av område, tidsintervall)

### **2. Backend (BFF) och dataintegration**

- Sätta upp REST API med C# .NET (inkl. routing, controllers, etc.)
- Implementera Repository Pattern för datalager
- Anslutning till externa dataleverantörer (ex. SVK:s MIMER API)
- Hantering av realtids- och historiska data (via in-memory databas initialt)

### **3. Datamodellering och lagring**

- Modellera väderdata och eldata utifrån API-respons
- Strukturera databas (initialt in-memory, möjligt att migrera till SQL eller liknande)
- Hantera uppdateringar av data med frekvens på 120 sekunder

### **4. Teknisk implementation av funktionalitet**

- State management via Redux i frontend
- Data-fetch via `fetch` eller `axios` mot BFF
- Säkerställa skalbarhet och framtida möjlighet till fler datakällor

---

### **Teknikstack**

| Lager | Teknik / Ramverk |
| --- | --- |
| Frontend | React, TypeScript, Redux |
| Backend | C# .NET Web API |
| API-hantering | REST, Swagger |
| Databas | In-memory (med möjlighet till SQL) |
| Kommunikation | Axios / Fetch |
| Kartfunktion | Map Library (ex: Leaflet, Mapbox) |

---

### **Datakällor och inspiration**

- **Svenska Kraftnät (MIMER API)**: [Swagger UI – MIMER](https://mimer.svk.se/swagger/ui/index#!/MimerAPI/MimerAPI_GetPrimaryRegulationStatistics)
- **Kontrollrummet (SVK)**: Visualisering av elproduktion/konsumtion [svk.se](https://www.svk.se/om-kraftsystemet/kontrollrummet/)
- **Nätområden.se**: Referens för geografisk nätindelning [natomraden.se](https://www.natomraden.se/)
- **Windy.com**: Inspiration för kartbaserad vädervisualisering [windy.com](https://www.windy.com/)

---

### **Förväntad leverans**

- En MVP med ett fungerande gränssnitt och grundläggande funktionalitet
- En kort dokumentation för varje teknisk komponent (frontend, backend, API-integration)
- Förslag på fortsatt utveckling och förbättring (t.ex. auth, responsiv design, mer datakällor)

Webb applikation för att få lättöverskådlig information om väder kontra el produktion/konsumtion inom den förnybara marknaden. 

**Mvp**:

- Frontend med dashboard, mapview och från varje nod på dashboard så kan vi bygga en graf över prognos och reality.
- BFF, C# .Net web Api applikation med endpoints för att serva frontend. Denna behöver flera delar för modellering, databas hantering, enkel användar hantering/ inlogg mm. Samt ett kommunikations lager som har kontakt med Data Suppliers.

### **Tekniker och arbete:**

**Backend**: 

restApi, Repository Pattern, datahantering, in-memory databas.

**Frontend**: 

React med Typescript, Redux Store, fetch eller axiom. 

State management via databas och BFF för olika användare.

**Inspiration**:
[https://www.windy.com/](https://www.windy.com/?59.428,17.965,5)            Snygg och bra kartfunktion
[Nätområden.se (natomraden.se)](https://www.natomraden.se/)      Nätområdesindelning tydlig

[Kontrollrummet | Svenska kraftnät (svk.se)](https://www.svk.se/om-kraftsystemet/kontrollrummet/)    Datan vi jobbar med visas här, geomgång kanske krävs

**Data**:
[Swagger UI (svk.se)](https://mimer.svk.se/swagger/ui/index#!/MimerAPI/MimerAPI_GetPrimaryRegulationStatistics)   MIMER   API för att hämta nätområden

**Arkitektur**:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/86cf58c6-9661-42f6-9dbb-ec3f44289a06/c839addb-f535-4e1f-8ccc-38e72aa008b6/Untitled.png)

## Sprint 1: Grundläggande Setup och Frontend-ramverk

- Sätta upp React/TypeScript projektstruktur
- Implementera grundläggande routing
- Konfigurera Redux för state management
- Skapa baslayout för dashboard

## Sprint 2: Backend-struktur och API

- Implementera C# .NET Web API struktur
- Sätta upp Repository Pattern
- Konfigurera in-memory databas
- Implementera första API endpoints

## Sprint 3: Dashboard och Dataintegration

- Skapa dynamiska dashboard widgets
- Implementera data-fetch mot BFF
- Integrera externa API:er (t.ex. MIMER)
- Hantera realtidsuppdateringar (120s intervall)

## Sprint 4: Kartvy och Visualisering

- Implementera kartkomponent med nätområdesindelning
- Integrera kartbibliotek (Leaflet/Mapbox)
- Skapa interaktiva väderöverlager
- Implementera nätområdesselektering

## Sprint 5: Grafer och Finputsning

- Utveckla jämförelsegraf-komponenter (prognos vs verklighet)
- Implementera användarflöden för tidsintervallsval
- Optimera prestanda och skalbarhet
- Slutlig testning och buggfixar

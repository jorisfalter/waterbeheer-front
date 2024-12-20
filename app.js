const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const app = express();
// Use the PORT provided by Heroku or default to 3000
const PORT = process.env.PORT || 3000;
const baseURL = "https://www.rijkswaterstaat.nl";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// first page - home
// https://www.rijkswaterstaat.nl/water/waterbeheer
app.get("/", async (req, res) => {
  try {
    // Fetch the original page content
    const response = await axios.get(`${baseURL}/water/waterbeheer`);
    let html = response.data;

    // Load the HTML into Cheerio for easy manipulation
    const $ = cheerio.load(html);

    // Inline the SVG logo
    const logoPath = path.join(__dirname, "public/images/logo-nl.svg");
    const logoSVG = fs.readFileSync(logoPath, "utf8");
    const logo = $(
      'img[alt="Logo Rijkswaterstaat | Ministerie van Infrastructuur en Waterstaat"]'
    );
    if (logo.length) {
      logo.replaceWith(logoSVG); // Replace the <img> with inline SVG content
    }

    // Convert relative URLs to absolute URLs for CSS, JS, and other images
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("/")) {
        $(element).attr("href", `${baseURL}${href}`);
      }
    });

    $("script").each((_, element) => {
      const src = $(element).attr("src");
      if (src && src.startsWith("/")) {
        $(element).attr("src", `${baseURL}${src}`);
      }
    });

    $("img").each((_, element) => {
      const src = $(element).attr("src");
      if (src && src.startsWith("/")) {
        $(element).attr("src", `${baseURL}${src}`);
      }
    });

    // link naar tweede pagina op het eind
    $('a[href="/water/vaarwegenoverzicht"]')
      .attr(
        "href",
        "/water/waterbeheer/bescherming-tegen-het-water/maatregelen-om-overstromingen-te-voorkomen/hoogwaterbeschermingsprogramma"
      )
      .text("Hoogwaterbeschermingsprogramma");

    // Inject JavaScript to rewrite content
    const customScript = `
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    document.querySelector("h1").textContent = "Water is heel belangrijk voor Nederland";
                    let elements = document.querySelectorAll("p");
                    if (elements[0]) elements[0].textContent = "Ons land ligt laag en heeft veel rivieren en meren. Daarom moeten we goed voor het water zorgen, zodat we droge voeten houden en veilig kunnen leven.";
                    if (elements[1]) elements[1].textContent = "Omdat Nederland laag ligt, kan het water soms te hoog komen. Dan kunnen er overstromingen gebeuren...";
                    if (elements[3]) elements[3].textContent = "Rijkswaterstaat zorgt voor het water in onze rivieren, meren, de Noordzee en de Waddenzee. Ze letten goed op of het water niet te hoog of te laag staat. Als dat nodig is, doen ze iets om het beter te maken. Ze zorgen er ook voor dat het water schoon blijft, zodat mensen kunnen drinken, boeren hun planten kunnen laten groeien, en dieren in de natuur fijn kunnen leven.";
                    if (elements[4]) elements[4].textContent = "Regen en de rivieren Rijn en Maas brengen water naar ons land. Rijkswaterstaat verdeelt dit water over heel Nederland. Zo zorgen ze ervoor dat we bij hoogwater veilig zijn tegen overstromingen. Als er weinig water is, zorgen ze dat er toch genoeg water is voor de natuur, de boerderijen en de schepen. Hiervoor gebruiken ze speciale poorten en dammen om het water goed te verdelen.";
                    if (elements[6]) elements[6].textContent = "Hoog water kan gevaarlijk zijn voor Nederland. Daarom doet Rijkswaterstaat veel om ons te beschermen tegen overstromingen, nu en in de toekomst.";
                    if (elements[7]) elements[7].textContent = "Ze houden het waterniveau altijd goed in de gaten en vertellen ons hoe hoog het water wordt. Met dijken, dammen en sterke muren zorgen ze ervoor dat het water niet zomaar het land in kan stromen. Als er heel veel water in de rivieren zit, sturen ze het via sluizen naar de zee, zoals bij de Haringvlietdam. Bij storm kunnen ze speciale waterpoorten, zoals de Oosterscheldekering, dichtdoen om ons veilig te houden.";
                    if (elements[8]) elements[8].textContent = "Rijkswaterstaat werkt ook samen met andere organisaties om rivieren breder te maken. Zo kunnen ze meer water kwijt, door stukken grond naast de rivier lager te maken en extra sloten te graven. De komende jaren gaan ze ook 1.300 km dijken extra stevig maken.";
                    if (elements[9]) elements[9].textContent = "Omdat de zomers in Nederland warmer en droger worden, hebben we vaker te maken met minder water in de rivieren. Bij droogte zorgt Rijkswaterstaat ervoor dat het beetje zoete water dat we hebben, eerlijk verdeeld wordt. Ze gebruiken hiervoor poorten, pompen en sluizen, zodat iedereen genoeg water heeft.";
                    if (elements[10]) elements[10].textContent = "Vanaf half maart proberen ze zoveel mogelijk water vast te houden. Ze zorgen ervoor dat er genoeg water blijft in het IJsselmeer en in de grond. Maar in de herfst en winter komt er vaak te veel water binnen om alles op te slaan. Daar hebben we niet genoeg ruimte voor.";
                    if (elements[11]) elements[11].textContent = "Een belangrijke taak van Rijkswaterstaat is om het water in de rivieren, meren, Noordzee en Waddenzee schoon te houden. Samen met andere landen zorgen ze voor water dat veilig is voor de landbouw, vissers, fabrieken en drinkwaterbedrijven. En het water moet goed zijn voor dieren en mensen die van de natuur willen genieten.";
                    if (elements[12]) elements[12].textContent = "Ze controleren steeds of er geen vieze stoffen in het water zitten die slecht zijn voor mensen en de natuur. Ook zorgen ze ervoor dat schepen hun afval niet zomaar in het water gooien.";
                    if (elements[13]) elements[13].textContent = "Daarnaast maken ze oevers waar planten en dieren goed kunnen leven. In plaats van beton gebruiken ze zand en riet. Hierdoor komen er weer veel dieren en planten terug in de rivieren. De planten helpen ook om het water op een natuurlijke manier schoon te maken en geven dieren, zoals de otter, bever en vissen, een veilige plek om te leven en op te groeien.";
                    if (elements[14]) elements[14].textContent = "Wij zorgen voor en verbeteren de grote wateren van Nederland, zoals de Waddenzee, Noordzee en het IJsselmeer. We letten goed op nieuwe technische mogelijkheden, werken samen met anderen en luisteren naar de wensen van mensen die deze wateren gebruiken.";

                });
            </script>
        `;

    // Append the custom script before the closing </body> tag
    $("body").append(customScript);

    // Send the modified HTML back to the client
    res.send($.html());
  } catch (error) {
    console.error("Error fetching or modifying the page:", error);
    res.status(500).send("Error loading the page");
  }
});

// second page - hoogwaterbeschermingsprogramma
// https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/maatregelen-om-overstromingen-te-voorkomen/hoogwaterbeschermingsprogramma
https: app.get(
  "/water/waterbeheer/bescherming-tegen-het-water/maatregelen-om-overstromingen-te-voorkomen/hoogwaterbeschermingsprogramma",
  async (req, res) => {
    try {
      // Fetch the original page content
      const response = await axios.get(
        `${baseURL}/water/waterbeheer/bescherming-tegen-het-water/maatregelen-om-overstromingen-te-voorkomen/hoogwaterbeschermingsprogramma`
      );
      let html = response.data;

      // Load the HTML into Cheerio for easy manipulation
      const $ = cheerio.load(html);

      // Inline the SVG logo
      const logoPath = path.join(__dirname, "public/images/logo-nl.svg");
      const logoSVG = fs.readFileSync(logoPath, "utf8");
      const logo = $(
        'img[alt="Logo Rijkswaterstaat | Ministerie van Infrastructuur en Waterstaat"]'
      );
      if (logo.length) {
        logo.replaceWith(logoSVG); // Replace the <img> with inline SVG content
      }

      // Convert relative URLs to absolute URLs for CSS, JS, and other images
      $('link[rel="stylesheet"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href && href.startsWith("/")) {
          $(element).attr("href", `${baseURL}${href}`);
        }
      });

      $("script").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      $("img").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      // link naar derde pagina op het eind
      $('a[href="https://www.hwbp.nl/"]').each((_, element) => {
        $(element)
          .attr(
            "href",
            "/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/dijken"
          )
          .html("Dijken");
      });

      // Inject JavaScript to rewrite content
      const customScript = `
                  <script>
                      document.addEventListener("DOMContentLoaded", function() {
                          let elements = document.querySelectorAll("p");
                          if (elements[0]) elements[0].textContent = "In het Hoogwaterbeschermingsprogramma (HWBP) werken de 21 waterschappen en Rijkswaterstaat samen om dijken sterker te maken. Dit is de grootste klus aan dijken sinds de Deltawerken. De komende jaren maken ze honderden kilometers dijken extra sterk. Zo zorgen ze ervoor dat Nederland veilig blijft om te wonen, te werken en te spelen.";
                          if (elements[1]) elements[1].textContent = "Al heel lang is er in Nederland niemand meer gestorven door overstromingen. Maar omdat een groot deel van ons land lager ligt dan de zee, blijven we kwetsbaar. Zonder onze dijken en duinen zou 60% van Nederland vaak onder water staan. Daarom is het heel belangrijk dat we ons blijven beschermen tegen hoog water.";
                    
                          if (elements[3]) elements[3].textContent = "Om ervoor te zorgen dat er geen ramp gebeurt, gebruiken we extra strenge veiligheidsregels. Waterschappen en Rijkswaterstaat controleren regelmatig de belangrijkste dijken en watermuren bij de rivieren, meren en de Noordzee om Nederland veilig te houden tegen overstromingen.";
                          if (elements[4]) elements[4].textContent = "Deze dijken en watermuren beschermen Nederland tegen overstromingen als het water heel hoog staat, zoals bij de Noordzee, Waddenzee, rivieren zoals de Rijn en Maas, en meren zoals het IJsselmeer en de Veluwerandmeren. Dijken die nog niet sterk genoeg zijn, worden sterker gemaakt binnen het Hoogwaterbeschermingsprogramma (HWBP).";
                          if (elements[5]) elements[5].textContent = "Bij het plannen van het werk kijken we eerst welke dijken het snelst versterkt moeten worden. De meest dringende projecten worden als eerste gedaan. Het plan voor deze dijken komt in het Deltaplan Waterveiligheid van het Deltaprogramma.";
                          if (elements[6]) elements[6].textContent = "Het doel van het Hoogwaterbeschermingsprogramma (HWBP) is om ervoor te zorgen dat alle belangrijke dijken, sluizen en pompen in 2050 sterk genoeg zijn. Ze moeten voldoen aan de regels die ervoor zorgen dat Nederland veilig blijft tegen overstromingen. In totaal gaat het om 2.000 kilometer dijken en bijna 400 sluizen en pompen die sterker gemaakt worden.";

                          if (elements[8]) elements[8].textContent = "In 2023 is er weer hard gewerkt om dijken sterker te maken. Alle resultaten van dat jaar hebben we in een verslag verzameld. In dit verslag vertellen we over wat we hebben bereikt, hoe we hebben samengewerkt, welke nieuwe ideeën we hebben gebruikt, hoe we aan duurzaamheid hebben gewerkt, en wat we hebben geleerd in 2023.";
      
                      });
                  </script>
              `;

      // Append the custom script before the closing </body> tag
      $("body").append(customScript);

      // Send the modified HTML back to the client
      res.send($.html());
    } catch (error) {
      console.error("Error fetching or modifying the page:", error);
      res.status(500).send("Error loading the page");
    }
  }
);

// third page - dijken
// https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/dijken
https: app.get(
  "/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/dijken",
  async (req, res) => {
    try {
      // Fetch the original page content
      const response = await axios.get(
        `${baseURL}/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/dijken`
      );
      let html = response.data;

      // Load the HTML into Cheerio for easy manipulation
      const $ = cheerio.load(html);

      // Inline the SVG logo
      const logoPath = path.join(__dirname, "public/images/logo-nl.svg");
      const logoSVG = fs.readFileSync(logoPath, "utf8");
      const logo = $(
        'img[alt="Logo Rijkswaterstaat | Ministerie van Infrastructuur en Waterstaat"]'
      );
      if (logo.length) {
        logo.replaceWith(logoSVG); // Replace the <img> with inline SVG content
      }

      // Convert relative URLs to absolute URLs for CSS, JS, and other images
      $('link[rel="stylesheet"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href && href.startsWith("/")) {
          $(element).attr("href", `${baseURL}${href}`);
        }
      });

      $("script").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      $("img").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      // link naar vierde pagina op het eind
      $('a[href="https://www.hwbp.nl/"]').each((_, element) => {
        $(element)
          .attr(
            "href",
            "/water/waterbeheer/bescherming-tegen-het-water/hoogwater/stormvloed"
          )
          .html("Stormvloed");
      });

      // In the third page route handler, before the customScript injection:
      $('li:contains("De bekende Afsluitdijk")').each((_, element) => {
        const text =
          "De bekende Afsluitdijk is geen dijk maar een dam. Een dijk scheidt het water van het land en een dam scheidt water van water.";
        $(element).html(text);
      });

      // In the third page route handler, before the customScript injection:
      $('li:contains("Tot 2031 is")').each((_, element) => {
        const text =
          "Tot 2031 is €7,9 miljard beschikbaar om 1.500 km aan dijken op 300 plekken te versterken.";
        $(element).html(text);
      });

      // Inject JavaScript to rewrite content
      const customScript = `
                    <script>
                        document.addEventListener("DOMContentLoaded", function() {
                            let elements = document.querySelectorAll("p");
                            if (elements[0]) elements[0].textContent = "Een dijk is een hoge, gemaakte wal die het land erachter beschermt tegen hoog water en grote golven.";


                            if (elements[3]) elements[3].textContent = "Tijdens de watersnoodramp in 1953 zagen we hoe belangrijk dijken zijn voor Nederland. Daarom houdt Rijkswaterstaat de waterstanden altijd goed in de gaten. Als er gevaar is dat een dijk kan breken, waarschuwen we de mensen die voor de dijken zorgen. Zij zorgen er dan voor dat alles veilig blijft.";
          
                        });
                    </script>
                `;

      // Append the custom script before the closing </body> tag
      $("body").append(customScript);

      // Send the modified HTML back to the client
      res.send($.html());
    } catch (error) {
      console.error("Error fetching or modifying the page:", error);
      res.status(500).send("Error loading the page");
    }
  }
);

// Vierde pagina - Stormvloed
// https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/hoogwater/stormvloed
https: app.get(
  "/water/waterbeheer/bescherming-tegen-het-water/hoogwater/stormvloed",
  async (req, res) => {
    try {
      // Fetch the original page content
      const response = await axios.get(
        `${baseURL}/water/waterbeheer/bescherming-tegen-het-water/hoogwater/stormvloed`
      );
      let html = response.data;

      // Load the HTML into Cheerio for easy manipulation
      const $ = cheerio.load(html);

      // Inline the SVG logo
      const logoPath = path.join(__dirname, "public/images/logo-nl.svg");
      const logoSVG = fs.readFileSync(logoPath, "utf8");
      const logo = $(
        'img[alt="Logo Rijkswaterstaat | Ministerie van Infrastructuur en Waterstaat"]'
      );
      if (logo.length) {
        logo.replaceWith(logoSVG); // Replace the <img> with inline SVG content
      }

      // Convert relative URLs to absolute URLs for CSS, JS, and other images
      $('link[rel="stylesheet"]').each((_, element) => {
        const href = $(element).attr("href");
        if (href && href.startsWith("/")) {
          $(element).attr("href", `${baseURL}${href}`);
        }
      });

      $("script").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      $("img").each((_, element) => {
        const src = $(element).attr("src");
        if (src && src.startsWith("/")) {
          $(element).attr("src", `${baseURL}${src}`);
        }
      });

      //   // link naar vijfde pagina op het eind
      //   $('a[href="https://www.hwbp.nl/"]').each((_, element) => {
      //     $(element).attr("href", "/water/vaarwegenoverzicht").html("Stormvloed");
      //   });

      $("div.rich-text.rich-text--list").remove();

      // Inject JavaScript to rewrite content
      const customScript = `
                      <script>
                          document.addEventListener("DOMContentLoaded", function() {
                              let elements = document.querySelectorAll("p");
                              if (elements[0]) elements[0].textContent = "Als het stormt en het water heel hoog staat, is het extra belangrijk om goed op de dijken en andere watermuren te letten.";
                              if (elements[1]) elements[1].textContent = "Het Watermanagementcentrum Nederland (WMCN) houdt dag en nacht de waterstanden en het weer in de gaten. Als er gevaar dreigt, waarschuwen ze de mensen die voor de dijken zorgen.";

                              if (elements[3]) elements[3].textContent = "Als het water bij een meetpunt hoger komt dan een bepaalde grens, noemen we dat een stormvloed. Die grens is bepaald door te kijken naar hoe hoog het water eerder is geweest bij stormen. Deze grens is op elke plek anders en wordt ongeveer eens per 2 jaar bereikt.";
                              if (elements[4]) elements[4].textContent = "Op elke plek hebben het WMCN en de mensen die voor de dijken zorgen afgesproken bij welke waterstanden er iets moet gebeuren. Er zijn twee belangrijke niveaus: het waarschuwingspeil, waarbij we extra opletten, en het alarmeringspeil, waarbij we meteen actie ondernemen.";
                              if (elements[5]) elements[5].textContent = "Het eerste belangrijke waterniveau heet het waarschuwingspeil. Als het water daarboven komt, nemen de mensen die voor de dijken zorgen kleine maatregelen. Dit gebeurt ongeveer één keer per jaar. De dijken kunnen dit meestal goed aan, maar we blijven toch extra opletten.";
                              if (elements[6]) elements[6].textContent = "Het tweede belangrijke waterniveau heet het alarmeringspeil. Als het water daarboven komt, nemen de mensen die voor de dijken zorgen grotere maatregelen. Het water is dan veel hoger, en de situatie is veel gevaarlijker. Dit gebeurt ongeveer één keer in de vijf jaar.";
                              if (elements[7]) elements[7].textContent = "Als we denken dat het water hoger komt dan het waarschuwingspeil, komt de crisisadviesgroep Kust en Benedenrivieren samen in de Waterkamer.";
                              if (elements[8]) elements[8].textContent = "In de Waterkamer houden waterexperts en een weerkundige van het KNMI de situatie goed in de gaten. Als ze verwachten dat het water hoger komt dan het waarschuwingspeil, waarschuwen ze de mensen die voor de dijken zorgen ongeveer 12 uur voordat het water op zijn hoogst is.";
                              if (elements[9]) elements[9].textContent = "De stormvloedwaarschuwingen worden ook online gedeeld, zodat andere belangrijke organisaties en mensen snel de informatie kunnen zien.";  
                              if (elements[10]) elements[10].textContent = "De mensen die voor de dijken zorgen nemen eerst kleinere maatregelen, zoals het sluiten van doorgangen in de dijken en het afsluiten van riolen. Als de experts denken dat het water zelfs boven het alarmeringspeil komt, worden er ook grotere maatregelen genomen, zoals het extra controleren van de dijken.";  
                              if (elements[11]) elements[11].textContent = "";  
                              if (elements[12]) elements[12].textContent = "Het WMCN gaat bij een alarmering niet zelf naar buiten om dijken en andere watermuren te controleren. Dat doen de mensen die voor de dijken zorgen, zoals de waterschappen en de regionale teams van Rijkswaterstaat. Met de waarschuwingen van het WMCN kunnen zij de juiste maatregelen nemen om Nederland veilig te houden.";  
                              if (elements[13]) elements[13].textContent = "Het WMCN waarschuwt als eerste de volgende groepen:";  
                              if (elements[14]) elements[14].textContent = "Daarna informeert het WMCN het publiek over het hoge water dat eraan komt. Dit doen ze via (social) media, zoals de website van Rijkswaterstaat, het Actueel Waterbericht, radio en televisie. De waterschappen roepen ondertussen dijklegers op. Dit zijn groepen vrijwilligers en professionals die de dijken controleren en, als het nodig is, maatregelen nemen.";  
                              if (elements[15]) elements[15].textContent = "Als het nodig is, worden er crisisstaven ingeschakeld. Dit is een groep van belangrijke bestuurders die samenkomt als er een noodsituatie is. Bij gevaar worden de waterkeringen en stormvloedkeringen gesloten om Nederland te beschermen.";  
                              if (elements[16]) elements[16].textContent = "";  
                              if (elements[17]) elements[17].textContent = "Als het WMCN in actie is gekomen, maken we binnen een paar dagen na de storm een stormvloedflits. Hierin staat kort wat er tijdens de stormvloed is gebeurd en welke waarschuwingen en alarmeringen zijn gegeven.";  
                              if (elements[18]) elements[18].textContent = "Als het water bij een of meer meetpunten hoger komt dan het grenspeil, noemen we dat een stormvloed. In dat geval maken we naast een stormvloedflits ook een stormvloedverslag. Dit verslag is uitgebreider en wordt binnen drie maanden na de storm gemaakt. Sinds 1948 zijn er stormvloedrapporten en sinds 1998 ook stormvloedflitsen.";  
                              if (elements[19]) elements[19].textContent = "Het onderdeel Kust van het WMCN heette tot 2012 de Stormvloedseindienst (SVSD). In 2021 bestond deze dienst al 100 jaar en heeft hij al een eeuw lang waarschuwingsberichten gemaakt bij stormen.";  
       
            
                          });
                      </script>
                  `;

      // Append the custom script before the closing </body> tag
      $("body").append(customScript);

      // Send the modified HTML back to the client
      res.send($.html());
    } catch (error) {
      console.error("Error fetching or modifying the page:", error);
      res.status(500).send("Error loading the page");
    }
  }
);

// landing page below
app.get("/water/waterbeheer", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

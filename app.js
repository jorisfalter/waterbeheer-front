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
        $(element).attr("href", "/water/vaarwegenoverzicht").html("Stormvloed");
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

      // link naar vijfde pagina op het eind
      $('a[href="https://www.hwbp.nl/"]').each((_, element) => {
        $(element).attr("href", "/water/vaarwegenoverzicht").html("Stormvloed");
      });

      // Inject JavaScript to rewrite content
      const customScript = `
                      <script>
                          document.addEventListener("DOMContentLoaded", function() {
                              let elements = document.querySelectorAll("p");
                              if (elements[0]) elements[0].textContent = "";
    
  
            
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

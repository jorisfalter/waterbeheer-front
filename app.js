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

    // // Replace the logo image with the local file
    // const logo = $(
    //   'img[alt="Logo Rijkswaterstaat | Ministerie van Infrastructuur en Waterstaat"]'
    // );
    // // console.log("logo");

    // // console.log(logo);
    // if (logo.length) {
    //   //   console.log("change-logo");
    //   logo.attr("src", "/images/logo-nl.svg"); // Local path to the logo in the 'public' directory
    // }

    // Inject JavaScript to rewrite content
    const customScript = `
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    document.querySelector("h1").textContent = "Water is heel belangrijk voor Nederland";
                    let elements = document.querySelectorAll("p");
                    console.log(elements[2])
                    if (elements[0]) elements[0].textContent = "Ons land ligt laag en heeft veel rivieren en meren. Daarom moeten we goed voor het water zorgen, zodat we droge voeten houden en veilig kunnen leven.";
                    if (elements[1]) elements[1].textContent = "Omdat Nederland laag ligt, kan het water soms te hoog komen. Dan kunnen er overstromingen gebeuren...";
                    if (elements[3]) elements[3].textContent = "Rijkswaterstaat zorgt voor het water in onze rivieren, meren, de Noordzee en de Waddenzee. Ze letten goed op of het water niet te hoog of te laag staat. Als dat nodig is, doen ze iets om het beter te maken. Ze zorgen er ook voor dat het water schoon blijft, zodat mensen kunnen drinken, boeren hun planten kunnen laten groeien, en dieren in de natuur fijn kunnen leven.";
                    if (elements[4]) elements[4].textContent = "Regen en de rivieren Rijn en Maas brengen water naar ons land. Rijkswaterstaat verdeelt dit water over heel Nederland. Zo zorgen ze ervoor dat we bij hoogwater veilig zijn tegen overstromingen. Als er weinig water is, zorgen ze dat er toch genoeg water is voor de natuur, de boerderijen en de schepen. Hiervoor gebruiken ze speciale poorten en dammen om het water goed te verdelen.";
                    if (elements[6]) elements[6].textContent = "Hoog water kan gevaarlijk zijn voor Nederland. Daarom doet Rijkswaterstaat veel om ons te beschermen tegen overstromingen, nu en in de toekomst.";
                    if (elements[7]) elements[7].textContent = "Ze houden het waterniveau altijd goed in de gaten en vertellen ons hoe hoog het water wordt. Met dijken, dammen en sterke muren zorgen ze ervoor dat het water niet zomaar het land in kan stromen. Als er heel veel water in de rivieren zit, sturen ze het via sluizen naar de zee, zoals bij de Haringvlietdam. Bij storm kunnen ze speciale waterpoorten, zoals de Oosterscheldekering, dichtdoen om ons veilig te houden.";
                    if (elements[8]) elements[8].textContent = "Rijkswaterstaat werkt ook samen met andere organisaties om rivieren breder te maken. Zo kunnen ze meer water kwijt, door stukken grond naast de rivier lager te maken en extra sloten te graven. De komende jaren gaan ze ook 1.300 km dijken extra stevig maken.";


                });
            </script>
        `;

    // if (elements[7]) elements[7].textContent = "Omdat de zomers in Nederland warmer en droger worden, hebben we vaker te maken met minder water in de rivieren. Bij droogte zorgt Rijkswaterstaat ervoor dat het beetje zoete water dat we hebben, eerlijk verdeeld wordt. Ze gebruiken hiervoor poorten, pompen en sluizen, zodat iedereen genoeg water heeft.";
    // if (elements[8]) elements[8].textContent = "Vanaf half maart proberen ze zoveel mogelijk water vast te houden. Ze zorgen ervoor dat er genoeg water blijft in het IJsselmeer en in de grond. Maar in de herfst en winter komt er vaak te veel water binnen om alles op te slaan. Daar hebben we niet genoeg ruimte voor.";
    // if (elements[]) elements[].textContent = "";
    // if (elements[]) elements[].textContent = "";
    // if (elements[]) elements[].textContent = "";

    // Append the custom script before the closing </body> tag
    $("body").append(customScript);

    // Send the modified HTML back to the client
    res.send($.html());
  } catch (error) {
    console.error("Error fetching or modifying the page:", error);
    res.status(500).send("Error loading the page");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

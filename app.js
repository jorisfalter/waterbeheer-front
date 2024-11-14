const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
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
                    if (elements[0]) elements[0].textContent = "Ons land ligt laag en heeft veel rivieren en meren. Daarom moeten we goed voor het water zorgen, zodat we droge voeten houden en veilig kunnen leven.";
                    if (elements[1]) elements[1].textContent = "Omdat Nederland laag ligt, kan het water soms te hoog komen. Dan kunnen er overstromingen gebeuren...";
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

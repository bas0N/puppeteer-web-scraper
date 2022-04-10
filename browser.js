const puppeteer = require("puppeteer");

async function startBrowser() {
  let browser;
  console.log("Starting");
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("error starting browser", err);
  }
  return browser;
}

module.exports = { startBrowser };

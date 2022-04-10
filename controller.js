const pageScrapper = require("./pageScrapper");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScrapper.scraper(browser);
  } catch (err) {
    console.log("browser instance error", err);
  }
}

module.exports = { scrapeAll };

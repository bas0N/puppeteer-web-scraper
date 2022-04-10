const scraperObject = {
  url: "http://books.toscrape.com",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Going to ${this.url}`);
    await page.goto(this.url);
    //waiting for a proper div to be fully rendered
    await page.waitForSelector(".page_inner");
    //getting link to all books
    let urls = await page.$$eval(
      "#default > div > div > div > div > section > div:nth-child(2) > ol > li",
      (links) => {
        // Make sure the book to be scraped is in stock
        links = links.filter(
          (link) =>
            link.querySelector(
              "#default > div > div > div > div > section > div:nth-child(2) > ol > li > article > div.product_price > p.instock.availability > i"
            ).textContent !== "In stock"
        );
        // Extract the links from the data
        links = links.map((el) => el.querySelector("h3 > a").href);
        return links;
      }
    );

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (link) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj["bookTitle"] = await newPage.$eval(
          ".product_main > h1",
          (text) => text.textContent
        );
        dataObj["bookPrice"] = await newPage.$eval(
          ".price_color",
          (text) => text.textContent
        );
        dataObj["noAvailable"] = await newPage.$eval(
          ".instock.availability",
          (text) => {
            // Strip new line and tab spaces
            text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
            // Get the number of stock available
            let regexp = /^.*\((.*)\).*$/i;
            let stockAvailable = regexp.exec(text)[1].split(" ")[0];
            return stockAvailable;
          }
        );
        dataObj["imageUrl"] = await newPage.$eval(
          "#product_gallery img",
          (img) => img.src
        );
        dataObj["bookDescription"] = await newPage.$eval(
          "#product_description",
          (div) => div.nextSibling.nextSibling.textContent
        );
        dataObj["upc"] = await newPage.$eval(
          ".table.table-striped > tbody > tr > td",
          (table) => table.textContent
        );
        resolve(dataObj);
        await newPage.close();
      });

    for (link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      // scrapedData.push(currentPageData);
      console.log(currentPageData);
    }
  },
};

module.exports = scraperObject;

/* 
const puppeteer = require('puppeteer')
const fs = require('fs/promises')
async function start(){
const browser=await puppeteer.launch()
const page = await browser.newPage()
await page.goto("https://learnwebcode.github.io/practice-requests/")
//await page.screenshot({path:"amazing.png"})
//await page.goto("https://de.wikipedia.org/wiki/Geschichte_des_Kantons_Aargau")
//await page.screenshot({path:"amazing3.png",fullPage:true})
const names = await page.evaluate(()=>{
  return  Array.from(document.querySelectorAll(".info strong")).map(x=>x.textContent)
})
await fs.writeFile("names.txt",names.join("\r\n"))

await page.click("#clickme")

const clickedData = await page.$eval("#data",el=>el.textContent)
console.log(clickedData);

const photos =  await page.$$eval("img",(images)=>{
return images.map(x=>x.src)
})
//insert text
await page.type("#ourfield","blue")
//click button, navigate and then
await Promise.all([page.click("#ourform button"), page.waitForNavigation()])
//click button


const info = await page.$eval("#message",el=>el.textContent)
console.log(info);
for (const photo of photos){
    const imagepage = await page.goto(photo)
    await fs.writeFile(photo.split("/").pop(),await imagepage.buffer())
}

await browser.close()
}

start()

//setInterval(start,5000)

*/
const browserObject = require("./browser");
const controller = require("./controller");

let browserInstance = browserObject.startBrowser();

controller.scrapeAll(browserInstance);

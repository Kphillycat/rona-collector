require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const INITIAL_URL = "https://unemployment.labor.ny.gov/login";

const crawler = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  async function shutItDown() {
    await browser.close();
  }

  try {
    await page.goto(INITIAL_URL, {
      waitUntil: "networkidle0",
    });

    await page.setViewport({ width: 1440, height: 719 });
    await page.click("button#login");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForSelector("input#loginform\\:username");
    await page.evaluate(
      async (username, password) => {
        document.querySelector("input#loginform\\:username").value = username;
        document.querySelector("input#loginform\\:password").value = password;
      },
      process.env.USER_NAME,
      process.env.PASSWORD
    );

    await page.click("button#loginform\\:signinButton", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#loginform\\:j_id1371991662_790d5049");

    await page.click("#loginform\\:j_id1371991662_790d5049");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    await shutItDown();
    return "fin";
  } catch (e) {
    console.error("Uh ohhhh ", e);
  }
};

crawler().then(console.log);

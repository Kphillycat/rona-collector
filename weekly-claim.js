require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const INITIAL_URL = "http://www.labor.ny.gov/signin";
const UNEMPLOYMENT_SERVICES_URL =
  "https://applications.labor.ny.gov/Individual/UIES/UIESConnectivity?DEST=UI&LOCALE=en_US";

const crawler = async () => {
  // Helper function for completing the claim form
  const completeClaimForm = () => {
    document.querySelector("#G05_REFUSE_OFFER0").checked = "checked";
    document.querySelector(
      '#G05_TOTAL_DAYS_WORKED > option[value="0"]'
    ).selected = true;
    document.querySelector("#G05_EXCEEDED_MAX_EARNINGS0").checked = "checked";
    document.querySelector(
      '#G05_DAYS_NOT_RWA > option[value="0"]'
    ).selected = true;
    document.querySelector(
      '#G05_VACATION_PAY_DAYS > option[value="0"]'
    ).selected = true;
    document.querySelector(
      '#G05_HOLIDAY_PAY_DAYS > option[value="0"]'
    ).selected = true;
    document.querySelector("#G05_RETURNED_FULL_TIME0").checked = "checked";
    document.querySelector('button[value="Continue"]').click();
    document.querySelector('button[value="Certify Claim"]').click();
  };

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
    await page.waitForSelector("#USERNAME");
    await page.evaluate(
      (username, password) => {
        document.querySelector("#USERNAME").value = username;
        document.querySelector("#PASSWORD").value = password;
      },
      process.env.USER_NAME,
      process.env.PASSWORD
    );

    await page.click("input.signinButton", { waitForNavigationUntil: "load" });

    page.goto(UNEMPLOYMENT_SERVICES_URL, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector('input[value="Claim Weekly Benefits"]');

    await page.click('input[value="Claim Weekly Benefits"]');

    await page.waitForSelector('input[value="Continue"]');
    await page.click('input[value="Continue"]');

    await page.waitForSelector('button[value="Certify Benefits"]');
    await page.click('button[value="Certify Benefits"]');

    await page.evaluate(completeClaimForm);

    await shutItDown();
    return "fin";
  } catch (e) {
    console.error("Uh ohhhh ", e);
  }
};

crawler().then(console.log);

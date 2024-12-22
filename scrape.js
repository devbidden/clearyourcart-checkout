const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: '2captcha', token: 'b9a9826a586a207bc4951fd5e3bfad8a' },
  })
);

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: "./tmp",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Navigate to the page with extended timeout
    await page.goto('https://www.aliexpress.com/item/1005007437181613.html', {
      waitUntil: 'domcontentloaded',
    });

    // Solve captchas, if any
    const { solved, error } = await page.solveRecaptchas();
    if (solved) {
      console.log('✔️ Captcha solved');
    } else {
      console.warn('❌ Captcha solving failed:', error);
    }hip

    // Retrieve the page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Correctly formatted selector
    const priceElements = await page.$$('.price--currentPriceText--V8_y_b5.pdp-comp-price-current.product-price-value');
    
    console.log(`Found ${priceElements.length} price element(s).`);

    // Loop through all elements and extract their text content
    for (const priceElement of priceElements) {
      const priceText = await page.evaluate(el => el.textContent.trim(), priceElement);
      console.log("Price:", priceText);

      // Simulate alert in the browser
      await page.evaluate(price => {
        alert(`Price: ${price}`);
      }, priceText);
    }

    if (title != null) {
      await browser.close();
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();

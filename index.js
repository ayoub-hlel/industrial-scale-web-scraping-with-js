import puppeteer from "puppeteer-core";

async function run(){
    let browser;
    try{
// here add the account ID and the zone of your proxylist
        const auth = 'USERNAME:PASSWORD';

        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@PROXYURL`
        });

        const page = await browser.newPage();
        page.getDefaultTimeout(2*60*1000);
        
        await page.goto('YOUR_TARGETED WEBSITE');

            const objectsData = await page.evaluate(() => {
                // for querySelector, a repeated class in your targets and add it as a variable for example here I used a-carousel-card
                const objectElements = document.querySelectorAll('a-carousel-card');

                const data = objectElements.map(obj => {
                    const objectName = obj.querySelector('THE_REPEATED_CLASS_I_MENTIONED_ABOVE').textContent.trim(); // change it with a repeating class :)
                    const objectURL = obj.querySelector('THE_REPEATED_CLASS_I_MENTIONED_ABOVE').href; // change it with a repeating class :)
                    return {
                        name: objectName,
                        url: objectURL,
                    };
                });
                return data;
            });   

            // to extract more data for an object's url
            const delay = ms => new Promise(res => setTimeout(res,ms));
            for (const objekt of objectsData) {
                console.log(`Navigating to: ${objekt.url}`);
                await page.goto(objekt.url);
                await delay(2000); // adding 2-seconds delay

                // data extraction here
            }; 
    }        
    catch(e){
        console.error('scrape failed',e);
    }
    finally{
        await browser?.close();
    }
}
run()
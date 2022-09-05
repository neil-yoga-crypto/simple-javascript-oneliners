import path from 'path';
import puppeteer from 'puppeteer';

// getScreenshot with optional extra viewport/clip settings (ex. clip =  { x: 0, y: 0, width: 1920, height: 2090 } for bigger screenshots)
export async function getScreenshot(folder,url,viewport={'width':1920,'height':1080},clip =null) {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(url);
    await waitTillHTMLRendered(page);
    if(clip) {
        await page.screenshot({ path: folder + path.sep + (+new Date()) + '.jpg', type: 'jpeg',clip:clip });

} else { 
        await page.screenshot({ path: folder + path.sep + (+new Date()) + '.jpg', type: 'jpeg'});
    }

    await page.close();
    await browser.close();
}

// Wait for DOM to fully load https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }  
};

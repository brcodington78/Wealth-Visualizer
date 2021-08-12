// const puppeteer = require('puppeteer');

// async function scrapeProduct(url) {
//     const browser = await puppeteer.launch({
//         ignoreDefaultArgs: ['--disable-extensions'],
//       });
//     const page = await browser.newPage();
//     await page.goto(url)

//     const [el] = await page.$x('//*[@id="jeff-bezos"]');
//     const src = await el.getProperty('src');
//     const srcTxt = await src.jsonValue();
// }

// scrapeProduct('https://www.forbes.com/billionaires/')


export const grabBillions = (doc) => {

    const billionaireData = []

    doc.querySelectorAll('.table-row').forEach(element => {
        let newPerson = {
            id: parseInt(element.querySelector('.rank').innerText.slice(0, element.querySelector('.rank').innerText.length - 1)),
            name: (element.querySelector('.personName').innerText),
            country: (element.querySelector('.countryOfCitizenship').innerText),
            netWorth: parseFloat((element.querySelector('.netWorth').innerText.match(/[+-]?\d+(\.\d+)?/g))[0]),
            age: parseInt(element.querySelector('.age').innerText),
            source: element.querySelector('.source').innerText,
            industry: element.querySelector('.category').innerText
    
        }
        
        billionaireData.push(newPerson)
        
        
    })
    return billionaireData
}


// var res = str.replace(/\D/g, "")
let puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
let from = 450; //start number of arrange
let to = 500;//end of arrange


//request to one site of company
async function makeRequest(page, url) {
  return await page.goto(url, { waitUntil: 'networkidle0' })
      .then(() => {
        //page.waitFor(1000);
        //if web company add to table in html
        let temp1;
        return new Promise(async (res, rej) => {
          //wait content dynamic load
            temp1 = await page.evaluate((url) => {
              let spheres = document.getElementsByClassName('gray')[0].innerHTML.split(', ');
              let isWeb = false;
              spheres.map(sphere => {
                if (sphere.replace(/\r?\n/g, "") === 'Web'){
                  isWeb = true;
                }
              });
              if(isWeb){
                return new Promise((resolve, reject) => { // <-- return the data to node.js from browser
                  let name = document.querySelector('h1').innerHTML;
                  let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
                      .children[2].children[0].children[0].innerHTML;
                  resolve([email,name,url]);
                });
              }
            });
            res(temp1);
        })
      })
}

(async() => {

  //start browser
  const browser = await puppeteer.launch({defaultViewport: null, headless: false});
  let page = await browser.newPage();
  const url = 'https://companies.dev.by/';

  //find all emails and names
  await page.goto(url, { waitUntil: 'load' });
  let getNames = () => {
    return page.evaluate(async () => {
      let list = [];
      return await new Promise(resolve => { // <-- return the data to node.js from browser
        [...document.getElementsByTagName("tbody")[0].children].map(child=>{
          list.push(child.children[0].children[0].href.split('/')[3]);
          console.log(child.children[0].children[0].innerText);
        });
        resolve(list);
      });
    })
  };
  let arrayNames = await getNames();  //get link-names of companies


  let tempar = await arrayNames.slice(from,to);
  let tasks = [];
  for (const url of await tempar) {
    tasks.push( await makeRequest(page, `https://companies.dev.by/${url}`));
  }
  Promise.all(tasks)
      .then((res) => {
        let toWrite ='';
        const newFile = path.join(__dirname,'files','companies.txt');
        for (let i = 0; i < tempar.length; i++) {
          if(res[i]){
            console.log(`${res[i][1]}: ${res[i][0]}`);
            toWrite = toWrite.concat(`${res[i][1]}: ${res[i][0]}\n`);
          }
        }
        fs.appendFile(newFile,toWrite,err=>{
          if(err){
            throw err;
          }
          console.log('finished');
        });
      });
})();
























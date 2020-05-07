let puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
let amount = 20; //20 companies per session

//request to one site of company
async function makeRequest(page, url) {
  return await page.goto(url, { waitUntil: 'networkidle0' })
      .then(() => {
        //page.waitFor(1000);
        //if web company add to table in html
        let temp1;
        return new Promise(async (res, rej) => {
          //wait content dynamic load
          temp1 = await page.evaluate(() => {
              return new Promise((resolve, reject) => { // <-- return the data to node.js from browser
                let name = document.querySelector('h1').innerHTML;
                let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
                    .children[2].children[0].children[0].innerHTML;
                resolve([email,name]);
              });
          });
          res(temp1);
        })
      })
}

let links = fs.readFileSync('./files/links.txt', 'utf8');  //Name: link format list of All companies
let list = fs.readFileSync('./files/companies.txt', 'utf8');  //Name: email format list of getted companies

links = links.split('\n');
list = list.split('\n');


let undefNamesList = []; //array of Names which emails are undefined
let linksObj = {}; //Name - link object for ALL companies = Database
let listObj = {}; //Name - email initial object, which needs to adding some undefined emails

links.map(link =>{
  link = link.split(': ');
  linksObj[link[0]] = link[1];
});

list.map(item=>{
  item = item.split(': ');
  listObj[item[0]] = item[1];
  if(item[1]==='⋯'){
    console.log(`'${item[0]}'`);
    undefNamesList.push(item[0]);
  }
});
console.log(`there are ${undefNamesList.length} emails left`); //information

(async() => {
  //start browser
  const browser = await puppeteer.launch({defaultViewport: null, headless: false});
  let page = await browser.newPage();
  let tasks = [];
  for (let i = 0; i < amount; i++) {
    if(!linksObj[undefNamesList[i]]){
      console.log(`error in ${undefNamesList[i]}`)
    }
    tasks.push( await makeRequest(page, `https://companies.dev.by/${linksObj[undefNamesList[i]]}`)); //take links from database of companies
  }
  Promise.all(tasks)
      .then((res) => {
        //define companies file again to update emails
        const newFile = path.join(__dirname,'files','companies.txt');
        for (let i = 0; i < amount; i++) {
          if(res[i]){
            console.log(`${res[i][1]}: ${res[i][0]}`);
            //complement initial listObj for found emails
            if(listObj[res[i][1]]){
              listObj[res[i][1]] = res[i][0];
            }
          }
        }
        let toWrite ='';
        for (let [key, value] of Object.entries(listObj)) {
          toWrite = toWrite.concat(`${key}: ${value}\n`);
        }
        fs.writeFile(newFile,toWrite,err=>{
          if(err){
            throw err;
          }
          console.log('finished');
        });
      });
})();
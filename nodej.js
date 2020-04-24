let puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const EventEmitter = require("slimerjs");
let companies = [];












(async() => {
  const browser = await puppeteer.launch({headless:false});
  let page = await browser.newPage();
  const url = 'https://companies.dev.by/';

  //find emails and names
  await page.goto(url, { waitUntil: 'load' });
  let getNames = () => {
    return page.evaluate(async () => {
      return await new Promise(resolve => { // <-- return the data to node.js from browser
        let list = [];
        [...document.getElementsByTagName("tbody")[0].children].map(child=>{
          list.push(child.children[0].children[0].href.split('/')[3]);
        });
        resolve(list);
      });
    })
  };
  let arrayNames = await getNames();  //get link-names of companies



  //get name and email from one by one site
  /*let getNameAndEmail = () => {
    return page.evaluate(async () => {
      return await new Promise(resolve => { // <-- return the data to node.js from browser
        //all companies !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!without WEB filter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log(!!document);
        let name = document.querySelector('h1').innerHTML;
        let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
            .children[2].children[0].children[0].innerHTML;
        resolve(email);
      });
    })
  };*/



  //main code
  /*for(let i=0;i<await arrayNames.length;){
    let nameUrl = await arrayNames[i];
    if (i<4){
      let temp1;
      console.log(`начинаем цикл для ${nameUrl}`);
      await page.goto(`https://companies.dev.by/${nameUrl}`, { waitUntil: 'load' })
          .then(()=>{
              page.waitFor(5000);
            return new Promise(res=> {
              //wait content dynamic load
              temp1 = page.evaluate(() => {
                return new Promise(resolve => { // <-- return the data to node.js from browser
                  let name = document.querySelector('h1').innerHTML;
                  let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
                      .children[2].children[0].children[0].innerHTML;
                  resolve(email);
                });
              });
            })
           })
          //})
          .then((res)=>{
              console.log(`https://companies.dev.by/${nameUrl}`,temp1);
              i++;
          });
    }
    else{
      break
    }
  }*/


  require('events').EventEmitter.prototype._maxListeners = 1700;
  async function makeRequest(page, url) {
    let tempPage = await browser.newPage();
    return await tempPage.goto(url, { waitUntil: 'networkidle0' })
        .then(() => {
          tempPage.waitFor(7000);
          let temp1;
          return new Promise(async (res) => {
            //wait content dynamic load
            temp1 = await tempPage.evaluate(() => {
              return new Promise((resolve, reject) => { // <-- return the data to node.js from browser
                let name = document.querySelector('h1').innerHTML;
                let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
                    .children[2].children[0].children[0].innerHTML;
                resolve(email);
              });
            });
            res(temp1);
          }).then(()=> tempPage.close())
        })
  }

  let tasks = [];
  for (let i = 0; i < 8; i++) {
    tasks.push( await makeRequest(page, `https://companies.dev.by/${arrayNames[i]}`));
  }
  Promise.all(tasks)
      .then((res) => {
        for (let i = 0; i < 8; i++) {
          console.log(`https://abcdsite.com/${arrayNames[i]}`, res[i]);
        }
      });

})();




/*
let spheres = document.getElementsByClassName('gray')[0].innerHTML.split(', ');
//if web company add to table in html
spheres.map(sphere => {
  if (sphere.replace(/\r?\n/g, "") === 'Web'){
    console.log(document.querySelector('h1').innerText);
  }
});
let name = document.querySelector('h1').innerText;
let email = document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0]
    .children[2].children[0].children[0].innerHTML;
companies.push({name: email});
const newFile = path.join(__dirname,'files','companies.txt');
fs.writeFile(newFile,`${name}:${email}`,err=>{
  if(err){
    throw err;
  }
  console.log(`Успешно найдено ${name}`)
});
*/






















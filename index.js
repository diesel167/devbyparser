window.onload = () =>{
/*
  let Result = {}; //result object with name and email
  let parser = new DOMParser();
  let doc;
  let names = [];
  function readTextFile(file){
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
      if(rawFile.readyState === 4){
        if(rawFile.status === 200 || rawFile.status === 0){
          doc = parser.parseFromString(rawFile.responseText, "text/html");
        }
      }
    };
    rawFile.send(null);
    fetch("https://cors-anywhere.herokuapp.com/https://companies.dev.by/recaptcha",{"referrer":'https://companies.dev.by/spurit',"method":"POST"})
        .then(response=>{
          console.log(response)
        });
  }

  readTextFile('dev.html');
  [...doc.getElementsByTagName("tbody")[0].children].map(child=>{
    names.push(child.children[0].children[0].href.split('/')[3]);
  });

  let runner = () =>{
    names.map(name=>{
      let url = 'https://cors-anywhere.herokuapp.com/https://companies.dev.by/'+name;
      $.ajax({
        url : url,
        type : "GET",
        dataType : "text",
        success : function(company){
            let companyDoc = parser.parseFromString(company, "text/html");
            let spheres = companyDoc.getElementsByClassName('gray')[0].innerHTML.split(', ');

            //if web company add to table in html
            spheres.map(sphere=>{
              if(sphere.replace(/\r?\n/g, "")==='Web'){
                let row = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.innerHTML = companyDoc.getElementsByTagName('h1')[0].innerHTML;
                let td2 = document.createElement('td');
                let div = companyDoc.getElementsByClassName('sidebar-views-contacts h-card vcard')[0].children;
                [...div].map(item=>{
                  if(item.tagName==='UL'){
                    td2.innerHTML = item.children[0].children[0].innerHTML;
                  }
                });
                row.appendChild(td1);
                row.appendChild(td2);
                document.getElementById('body').appendChild(row);
              }
            });
        },
      });
    })
  };
  runner();*/

  let openedWindow;
  openedWindow = window.open(
      'https://companies.dev.by/spurit',
      "DescriptiveWindowName",
      "resizable,scrollbars,status"
  );



  setTimeout(function closeOpenedWindow() {
    openedWindow.close();
  },3500)

};

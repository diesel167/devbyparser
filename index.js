
window.onload = () =>{
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
  }

  readTextFile('dev.html');
  [...doc.getElementsByTagName("tbody")[0].children].map(child=>{
    names.push(child.children[0].children[0].href.split('/')[3]);
  });


  names.map(name=> {
    let company;
    $.ajax({
      url: `https://cors-anywhere.herokuapp.com/localhost:5050/${name}`,
      text: name,
      success: function(ans){
        console.log(ans)
      }
    });
    /*let spheres = company.document.getElementsByClassName('gray')[0].innerHTML.split(', ');
     //if web company add to table in html
     spheres.map(sphere => {
       if (sphere.replace(/\r?\n/g, "") === 'Web') {
         let row = document.createElement('tr');
         let td1 = document.createElement('td');
         td1.innerHTML = company.document.getElementsByTagName('h1')[0].innerHTML;
         let td2 = document.createElement('td');
         let div = company.document.getElementsByClassName('sidebar-views-contacts h-card vcard')[0].children;
         [...div].map(item => {
           if (item.tagName === 'UL') {
             td2.innerHTML = item.children[0].children[0].innerHTML;
           }
         });
         row.appendChild(td1);
         row.appendChild(td2);
         document.getElementById('body').appendChild(row);
       }
     });*/
  });


};

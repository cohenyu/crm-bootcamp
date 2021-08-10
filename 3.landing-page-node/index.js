const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
app.use(express.static('views'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views'); //For calling from location down.
const axios = require('axios');


app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});


/**
 * Rendering of the leads page
 */
 app.get('/admin', function(req, res) {
  var params = req.query;
  const data = {
    title: "Leads",
    logo:"RGB",
    business: "Gradiz",
    headers: ["Full Name", "Email", "Phone"],
    sort: {
      order: "Order By:",
      // placeholderOrder: "choose order",
      options: ["ascending", "descending"]
    }
  }
  res.render('leads', data);
});


/**
 * Rendering of the landing page
 */
app.get('/', function(req, res) {
  var params = req.query;
  const data = {
    logo: "Gradiz",
    circles: createCircles(10),
    navigation: [ 
      makeNav("Home"), 
      makeNav("About Us"), 
      makeNav("Gallery"), 
      makeNav("Contact"), 
    ],
    maintitle:[ {text: "Professional Graphic"} ,{text:"Design Service"}],
    subtitle: "Design anything you need",
    form: {
      details: {
        name: params.name ? "We got your details, " + params.name + "!" : ""
      },
      title: "Leave your details and we'll get back to you!",
      inputs: [
        // makeInput("text", "name", "Full Name", "error-name"),
        // makeInput("email", "mail", "Mail", "error-mail"),
        // makeInput("tel", "phone", "Phone", "error-phone")
        makeInput("text", "name", "Full Name", "error-name"),
        makeInput("text", "mail", "Mail", "error-mail"),
        makeInput("text", "phone", "Phone", "error-phone")
      ],
      button: {
        text: "Send Details",
        type: "submit"
      },
    },
    footer: {
      title: 'Why choose Gradiz?',
      answers: [
        makeAnswer([{part:"Best"}, {part: "Prices"}], '' ,"$$$"),
        makeAnswer([{part:"Express"} ,{part:"Service"}], img_src="assets/fast_clock_orange.png"),
        makeAnswer([{part:"Expert"} ,{part:"Designers"}], img_src="assets/expert.png")
      ]
    }
  }

  res.render('landing-page', data);
});

function createCircles(num){
  let circlesArray = []
  for (let i = 0; i < num; i++){
      circlesArray.push("");
  }
  return circlesArray;
}

function makeInput(typeValue, idValue, placeholderValue, errorIdValue){
  return {
    type: typeValue,
    id: idValue,
    placeholder: placeholderValue,
    error_id: errorIdValue,
  }
}

function makeNav(titleValue, url="#"){
  return {
    title: titleValue, 
    link: url
  }
}


function makeAnswer(titleVal, imgSrc='', textVal=''){
  return {
    title: titleVal,
    img: imgSrc,
    text: textVal
  }
}

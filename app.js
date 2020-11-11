const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000
var methodOverride = require('method-override')

app.set('view engine', 'pug');

app.use(express.static('public'));

var fs = require('fs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


var moment = require('moment');

app.post("/remove/:file/:index", function (req, res){
  var file = moment().format('YYYY-MM-DD') + ".json";
  var list = [];
  if (fs.existsSync(file)){
    list = JSON.parse(fs.readFileSync(file, "utf-8"))
  }

  list.splice(req.params.index, 1);

  fs.writeFileSync(file, JSON.stringify(list), function (err) {
    if (err){
      console.log("err")
    }
      console.log("ok")
  });

  console.log(req.params);
  res.redirect("/")
});


app.post("/edit/:file/:index", function (req, res){
  var file = moment().format('YYYY-MM-DD') + ".json";
    var list = [];
    if (fs.existsSync(file)){
      list = JSON.parse(fs.readFileSync(file, "utf-8"))
    }
  var record = list [req.params.index]
  record.index = req.params.index
  console.log(record)
  res.render("edit", {
    record
  });
});

app.post('/saveEdit', (req, res) => {
  var file = moment().format('YYYY-MM-DD') + ".json";
  var list = [];
  if (fs.existsSync(file)){
    list = JSON.parse(fs.readFileSync(file, "utf-8"))
  }

  var recordNew = {
    "title": req.body.title,
    "price": req.body.price,
  }

  list[req.body.record_index] = recordNew

  fs.writeFileSync(file, JSON.stringify(list), function (err) {
    if (err){
      console.log("err")
    }
      console.log("ok")
  });
  res.redirect("/")
})



app.get('/', (req, res) => {
  var isDateError = false;
  var file = "nofile";
  var date = "";

  if (req.query.date){
    if (moment(req.query.date).isValid()) {
      var file = moment(req.query.date).format('YYYY-MM-DD') + ".json"
      date = req.query.date
    } else {
      isDateError = true
    }
  } else {
    var file = moment().format('YYYY-MM-DD') + ".json" 
  }


  var list = [];
    if (fs.existsSync(file)){
      list = JSON.parse(fs.readFileSync(file, "utf-8"))
    }

  res.render('index', {
      list,
      isDateError,
      date,
      file
  });
})

app.get('/new', (req, res) => {
  res.render('new', {
  });
})

app.get('/calendar', (req, res) => {
  res.render('calendar', { 
  });
})



app.post('/save', (req, res) => {
  var file = moment().format('YYYY-MM-DD') + ".json";
  var list = [];

  try {
    if (fs.existsSync(file)){
      list = JSON.parse(fs.readFileSync(file, "utf-8"))
    }
  } catch (err) {
    console.log(err)
  }

  list.push({
      title: req.body.title,
      price: req.body.price
  });

  fs.writeFileSync(file, JSON.stringify(list), function (err) {
    if (err){
      console.log("err")
    }
      console.log("ok")
  });
  res.redirect("/")
  // res.render('save', {
  //     title: req.body.title,
  //     price: req.body.price,
  //     date: file
  // });
})
 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
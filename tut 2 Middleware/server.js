const path = require("path");
const express = require("express");
const app = express();
// const logEvents = require("./middleware/logEvents");
const { logger } = require("./middleware/logEvents");
const errorHander = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;
const cors = require("cors");

//costome middleware( put in at top (recomemmded : This ensures that the custom logic is executed first for every incoming request.))
// app.use() is used to apply middleware to  all routes that are comming in.
app.use(logger);

// for 3rd party middleware
// the Domains that will have access to the data or backend server()
// domain that can access routs(other that this routs no other domain can access data. you will get cors error)
const whitelist = [
  "https:/www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
// you should remove the some of the development url at production time

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) != -1 || !origin) {
      // remove !origin also at production time
      callback(null, true);
    } else {
      callback(new Error("Not allowed by Cors"));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(cors())
// now you will not get cros error. so we can request data from 3rd party.

//------------------------------------------------------------------------

//built in middelware to handle url-encoded data
// in other words, form data:
//'content-type' "application/x-www.form-urlencoded"
// after form data is submitted

app.use(express.urlencoded({ extended: false })); // next() is built-in
// if use app.use about the all routes then this will use by all routes.

app.use(express.json()); // for json data

app.use(express.static(path.join(__dirname, "/public"))); // now you will see images,css(if in separate folder)
// after this we need to create public folder and move folders like images,css etc.
// now you can just mention the css link in html file as: 'css/style.css, no need to add
//..css/style.css
app.get("^/$|/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(path.join(__dirname, "views", "new-page.html"));
});

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("finished");
};
app.get("/chain(.html)?", [one, two, three]);
// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });
app.all("*", (req, res) => {
  // app.all will applay to all http reqyes and also accepts rejected routs
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error hander
app.use(errorHander);

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});

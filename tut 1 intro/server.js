const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

// app.get("/", (req, res) => {
app.get("^/$|/index.html", (req, res) => {
  // here we get same page on writing index.html
  // syntax: start or end with / or index.html
  //
  // res.send("Hello World")
  //   res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?", (req, res) => {
  // add ()? to extension to access with outextension
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  // redirect to new page.
  res.redirect(301, path.join(__dirname, "views", "new-page.html")); // by default it is 302. 302 will not tell search engine to parmanent redirect so we use 301
});

// route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attepted to load hello.html");
    next(); // Pass control to the next function
  },
  (req, res) => {
    res.send("Hello World");
  }
);
// alternate to this:
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
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

// Costome 404 file/page not found( By defalut Handle by Express)
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html")); // by defalut it 200 bcoz 404 file exits
}); // it handle all the other routs and redirect them to 404.html(costome 404 file)

app.listen(PORT, () => console.log("server is running on port " + PORT));

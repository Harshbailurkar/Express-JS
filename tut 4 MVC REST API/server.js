const path = require("path");
const express = require("express");
const app = express();
const { logger } = require("./middleware/logEvents");
const errorHander = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json()); // for json data

// for giveing access to the static folders.
app.use(express.static(path.join(__dirname, "/public"))); // default directory is '/'
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//Routes

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./model/employees"));

app.all("*", (req, res) => {
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

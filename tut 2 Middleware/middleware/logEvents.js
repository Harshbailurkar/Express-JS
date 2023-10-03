const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fspromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const datetime = `${format(new Date(), "yyyyMMdd\t HH:mm:ss")}`;
  const logItems = `${datetime}\t ${uuid()} \t ${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fspromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    //  for testing
    await fspromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItems
    );
    console.log("text updated in logName");
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t ${req.headers.origin} \t ${req.url}`,
    "reqLog.txt"
  );
  console.log(req.method + req.path);
  next(); // next() is important for next execution
};

module.exports = { logEvents, logger };

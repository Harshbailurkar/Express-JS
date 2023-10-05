const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(path.join(__dirname, "views", "new-page.html"));
});

module.exports = router;

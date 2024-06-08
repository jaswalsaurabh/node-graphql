const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hi from node graphql server");
});

module.exports = { router };

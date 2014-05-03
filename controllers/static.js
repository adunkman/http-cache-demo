module.exports = function (app) {
  app.get("/", render_index);
};

var render_index = function (req, res) {
  res.render("index");
};

module.exports = function (app) {
  app.get("/", render_header_forms);
};

var render_header_forms = function (req, res) {
  res.render("header_form");
};

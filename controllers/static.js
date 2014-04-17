module.exports = function (app) {
  app.get("/", render_header_forms);
};

var render_header_forms = function (req, res) {
  res.send(200);
};

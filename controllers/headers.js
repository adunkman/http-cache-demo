var child = require("child_process");
var response_headers = [];

module.exports = function (app) {
  app.get("/request", make_request_through_proxy);
  app.get("/request/internal", respond_to_proxy_request);
  app.get("/headers", send_headers);
  app.post("/headers", update_headers);
};

var update_headers = function (req, res) {
  response_headers = parse_incoming_headers(req.body.headers);
  send_headers(req, res);
};

var send_headers = function (req, res) {
  res.send({ headers: response_headers });
};

var parse_incoming_headers = function (questionable_headers) {
  var valid_headers = [];

  for (var i = 0, length = questionable_headers.length; i < length; i++) {
    var header = questionable_headers[i];
    var parts = header.split(":");

    if (parts.length >= 2 && parts[0].trim().length && parts[1].trim().length) {
      valid_headers.push(header)
    }
  };

  return valid_headers;
};

var respond_to_proxy_request = function (req, res) {
  req.app.get("io").sockets.emit("server_response", true);

  for (var i = 0, length = response_headers.length; i < length; i++) {
    var parts = response_headers[i].split(":");
    var name = parts.shift();
    var value = parts.join(":");

    res.setHeader(name, value);
  }

  res.send("An otherwise empty response.");
};

var make_request_through_proxy = function (req, res) {
  var url = expand_to_full_url(req.connection.server, "/request/internal");
  var should_force_reload = req.headers["force-reload"] === "true";

  make_squidclient_request_to(url, should_force_reload, function (err, response) {
    if (err) res.send(500, seralize_error(err, "Could not execute squidclient successfully."));
    else {
      for (var i = 0, length = response.headers.length; i < length; i++) {
        var parts = response.headers[i].split(":");
        var name = parts.shift();
        var value = parts.join(":");

        res.setHeader(name, value);
      }
      res.send(response.status, response.body);
    }
  });
};

var expand_to_full_url = function (server, path) {
  var info = server.address();
  return "http://" + info.address + ":" + info.port + path;
};

var make_squidclient_request_to = function (url, should_force_reload, callback) {
  var command = ["squidclient"];
  if (should_force_reload) command.push("-r");
  command.push(url);

  child.exec(command.join(" "), function (err, stdout) {
    if (err) callback(err);
    else parse_proxy_response(stdout.toString(), callback);
  });
};

var parse_proxy_response = function (response, callback) {
  var err;

  try {
    var status_line = response.split("\r\n")[0];
    var status = parseInt(status_line.match(/\d{3}/)[0], 10);
    var response_lines = response.replace(status_line + "\r\n", "").split("\r\n");

    response = {
      status: status,
      headers: response_lines.slice(0, response_lines.length-2),
      body: response_lines.slice(-1).join("\r\n")
    };
  }
  catch (e) {
    err = e;
  }

  callback(err, response);
};

var seralize_error = function (err, details) {
  var seralized = JSON.parse(JSON.stringify(err));
  seralized.message = err.message.trim();
  seralized.details = details;

  return seralized;
};

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
    var parts = header.split(": ");

    if (parts.length >= 2 && parts[0].trim().length && parts[1].trim().length) {
      valid_headers.push(header.replace(parts[0], parts[0].toLowerCase()));
    }
  };

  return valid_headers;
};

var respond_to_proxy_request = function (req, res) {
  req.app.get("io").sockets.emit("server_response", true);

  for (var i = 0, length = response_headers.length; i < length; i++) {
    var parts = response_headers[i].split(": ");
    var name = parts.shift();
    var value = parts.join(": ");

    res.setHeader(name, value);
  }

  res.send("An otherwise empty response.");
};

var make_request_through_proxy = function (req, res) {
  var url = expand_to_full_url(req.connection.server, "/request/internal");

  make_squidclient_request_to(url, req.headers, function (err, response) {
    if (err) res.send(500, seralize_error(err, "Could not execute squidclient successfully."));
    else {
      for (var i = 0, length = response.headers.length; i < length; i++) {
        var parts = response.headers[i].split(": ");
        var name = parts.shift();
        var lowercase_name = name.toLowerCase()
        var value = parts.join(": ");

        if (lowercase_name == "content-type" || lowercase_name == "content-length") {
          continue;
        }

        res.setHeader(name, value);
      }

      var request_headers = "";
      for (var key in req.headers) {
        request_headers += key + ": " + req.headers[key] + "\r\n";
      }

      if (should_send_304(req.headers)) {
        req.app.get("io").sockets.emit("not_modified_response", request_headers);
      }

      res.send(response.status, request_headers);
    }
  });
};

var expand_to_full_url = function (server, path) {
  var info = server.address();
  return "http://" + info.address + ":" + info.port + path;
};

var make_squidclient_request_to = function (url, headers, callback) {
  var command = ["squidclient"];
  var should_force_reload = headers["force-reload"] === "true";
  var request_headers = [];

  if (headers["if-none-match"]) {
    request_headers.push("if-none-match: " + headers["if-none-match"]);
  }

  if (headers["if-modified-since"]) {
    request_headers.push("if-modified-since: " + headers["if-modified-since"]);
  }

  if (should_force_reload) command.push("-r");
  if (request_headers.length) command.push("-H '" + request_headers.join("\\n").replace(/'/g, "\\'") + "\\n'");
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

var should_send_304 = function (request_headers) {
  var entities_match = headers_match(request_headers, "if-none-match", "etag");
  var not_modified = headers_match(request_headers, "if-modified-since", "last-modified");

  return entities_match || not_modified;
};

var headers_match = function (request_headers, req_header, res_header) {
  var req_header_value = request_headers[req_header];

  if (req_header_value == null) {
    return false;
  }

  var res_header_value;

  for (var i = 0, length = response_headers.length; i < length; i++) {
    var parts = response_headers[i].split(": ");
    var name = parts.shift();

    if (name.toLowerCase() == res_header) {
      res_header_value = parts.join(": ");
      break;
    }
  }

  return req_header_value == res_header_value;
};

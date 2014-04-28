var Tail = require("tail").Tail;

module.exports = function (app) {
  var log = "/usr/local/var/logs/access.log";
  parse_and_send_squid_log(app.get("io"), log);
};

var parse_and_send_squid_log = function(io, filename) {
  new Tail(filename).on("line", io.sockets.emit.bind(io.sockets, "cache_response"));
};

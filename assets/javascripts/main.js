//= require vendor/jquery
//= require vendor/underscore
//= require vendor/backbone
//= require handlebars/dist/handlebars.runtime
//= require socket.io/node_modules/socket.io-client/dist/socket.io

//= require_self

//= require_tree models
//= require_tree templates
//= require_tree views

//= require router

var App = { Models: {}, Views: {} };

$(document).ready(function () {
  App.socket = io.connect();
  new App.Router();
  Backbone.history.start({ pushState: true });
});

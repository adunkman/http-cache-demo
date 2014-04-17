//= require vendor/jquery
//= require vendor/underscore
//= require vendor/backbone

//= require_self

//= require_tree models
//= require_tree views

var App = { Models: {}, Views: {} };

$(document).ready(function () {
  new App.Views.Headers({ el: document });
});

class App.Router extends Backbone.Router
  routes:
    "": "show_pipeline"

  initialize: ()  ->
    @request = new App.Models.Request()

  show_pipeline: () ->
    @request_view or= new App.Views.Request(model: @request, el: $("body"))

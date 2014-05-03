class App.Router extends Backbone.Router
  routes:
    "": "show_pipeline"

  initialize: ()  ->
    @endpoint = new App.Models.Endpoint()

  show_pipeline: () ->
    @request_view or= new App.Views.Request(model: @endpoint, el: $("body"))
    @response_view or= new App.Views.Response(model: @endpoint, el: $(".response"))

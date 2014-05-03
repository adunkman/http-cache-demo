class App.Router extends Backbone.Router
  routes:
    "": "show_pipeline"

  initialize: ()  ->
    @request = new App.Models.Request()
    @headers = new App.Models.Headers()

  show_pipeline: () ->
    @request_view or= new App.Views.Request(model: @request, el: $("body"))
    @headers_view or= new App.Views.Headers(model: @headers, el: $("body"))
    @errors_view or= new App.Views.Errors(el: $(".error-messages"))

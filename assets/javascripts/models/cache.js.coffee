class App.Models.Cache extends Backbone.Model
  initialize: () ->
    App.socket.on("cache_response", () => @set("responded", true))

  reset: () ->
    @set("responded", false)

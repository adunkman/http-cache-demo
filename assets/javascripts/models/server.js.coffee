class App.Models.Server extends Backbone.Model
  initialize: () ->
    App.socket.on("server_response", () => @set("responded", true))

  reset: () ->
    @set("responded", false)

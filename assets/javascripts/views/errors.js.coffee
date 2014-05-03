class App.Views.Errors extends Backbone.View
  disconnected: true
  request_failure: false

  initialize: () ->
    @messages = @$(".messages")

    App.socket.on("connect", @render_after(() -> @disconnected = false))
    App.socket.on("disconnect", @render_after(() -> @disconnected = true))

    $(document).ajaxSuccess(@render_after(() -> @request_failure = false))
    $(document).ajaxError(@render_after(() -> @request_failure = true))

    # Give the socket 1 second to connect before complaining about it.
    _.debounce(@render, 1000)()

  render_after: (fn) -> () =>
    fn.call(this)
    @render()

  render: () =>
    messages = []
    messages.push("Request Failed") if @request_failure
    messages.push("Disconnected") if @disconnected

    @messages.toggleClass("is-visible", messages.length isnt 0)
    @messages.text(messages.join(", ")) if messages.length

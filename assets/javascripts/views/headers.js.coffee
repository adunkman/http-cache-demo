class App.Views.Headers extends Backbone.View
  events:
    "click .pipeline .server": "show_header_form"
    "click .header-form button": "save_headers"
    "keyup": "close_on_escape"

  initialize: () ->
    @listenTo(@model, "change", @render)

  show_header_form: () ->
    @model.fetch()
    @$el.addClass("header-form-is-visible")
    @$(".header-form textarea").focus()

  close_on_escape: (evt) =>
    @close() if evt.keyCode is 27

  close: () ->
    @$el.removeClass("header-form-is-visible")
    @$(".initiate-request button").focus()

  save_headers: () ->
    @model.save(headers: @$(".header-form textarea").val().split("\n"))
    @close()

  render: () ->
    @$(".header-form textarea").val(@model.get("headers")?.join("\n"))

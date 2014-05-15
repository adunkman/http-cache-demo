#= require ./header_parsing

class App.Views.Headers extends App.Views.HeaderParsing
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
    headers = @model.get("headers")

    if headers.length
      parsed_headers = @parse_headers(headers.join("\r\n"))
      headers = ("#{header.key}: #{header.value}" for header in parsed_headers)

    @$(".header-form textarea").val(headers.join("\r\n"))

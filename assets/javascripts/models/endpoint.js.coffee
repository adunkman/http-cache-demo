class App.Models.Endpoint extends Backbone.Model
  url: "/request"

  initialize: () ->
    App.socket.on("cache_response", @response_detected("cache_response"))
    App.socket.on("server_response", @response_detected("server_response"))

  response_detected: (from) -> () =>
    @set(from, true)

  fetch: () ->
    @clear()
    super

  parse: (response, options) ->
    status: "#{options.xhr.status} #{options.xhr.statusText}"
    headers: @parse_headers(options.xhr.getAllResponseHeaders().trim().split("\r\n"))

  parse_headers: (headers) ->
    headers = for header in headers
      [key, value] = header.split(": ")

      key: @to_title_case(key)
      value: value

    headers.sort(@sort_by_key)

  to_title_case: (string) ->
    string.toLowerCase().replace(/\b./g, (character) -> character.toUpperCase())

  sort_by_key: (a, b) ->
    if a.key > b.key then 1 else -1

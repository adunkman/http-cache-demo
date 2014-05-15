class App.Models.Request extends Backbone.Model
  url: "/request"

  initialize: () ->
    App.socket.on("cache_response", @response_detected("cache_response"))
    App.socket.on("server_response", @response_detected("server_response"))
    App.socket.on("not_modified_response", @store_request_headers)

  response_detected: (from) -> () =>
    @set(from, true)

  store_request_headers: (headers) =>
    @set("request", headers)

  fetch: (options = {}) ->
    @clear()
    options.dataType = "text"
    super

  parse: (response, options) ->
    status:
      if @get("request") then "304 Not Modified"
      else "#{options.xhr.status} #{options.xhr.statusText}"
    response_headers: options.xhr.getAllResponseHeaders()
    request_headers: @get("request") or response

  parse_headers: (headers) ->
    headers = for header in headers.trim().split("\r\n")
      [key, value] = header.split(": ")

      key: @to_title_case(key)
      value: value

    headers.sort(@sort_by_key)

  to_title_case: (string) ->
    string.toLowerCase().replace(/\b./g, (character) -> character.toUpperCase())

  sort_by_key: (a, b) ->
    if a.key > b.key then 1 else -1

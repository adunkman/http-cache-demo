class App.Views.HeaderParsing extends Backbone.View
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

exports.config = (config) ->
  config.files "app/assets/**"
  config.files "vendor/assets/**"

  config.match 'app/assets/javascripts/:file', route_path
  config.match 'app/assets/stylesheets/:file', route_path
  config.match 'app/assets/images/:file', route_path
  config.match 'vendor/assets/javascripts/:file', route_path
  config.match 'vendor/assets/stylesheets/:file', route_path
  return

  route_path = (file) ->
    return 'assets'

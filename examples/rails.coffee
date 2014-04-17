exports.config = (config) ->
  # File path glob patterns.
  # All file paths matching these glob patterns will be watched for changes,
  # and when they are detected, the matching URL cache will be expired.
  config.watch "app/assets/**"
  config.watch "vendor/assets/**"

  # Match file paths to their corresponding URLs.
  # The first argument is the match pattern, and the second argument is the
  # translation function. Any captures made by the matching pattern will be
  # passed into the translation function in the order they are matched. The
  # returned URL String from the translation function will be used to expire
  # the cache for that URL.
  config.url 'app/assets/:filepath', assets_path
  config.url 'vendor/assets/:filepath', assets_path

  # Establish a white list of URL Strings of the paths to cache.
  # If an incoming request URL does not match an include pattern, it will not
  # be cached and will be simply reverse proxied to the server.
  config.include /\.js$/

  return


  assets_path = (filepath) ->
    return "/assets/#{filepath}"

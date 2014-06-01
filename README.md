Dev Proxy
==========

An HTTP proxy designed to speed local development of web applications running from other local development environments (like Rails).

Dev Proxy is basically a reverse proxy with caching built in, running on a Node.js server. The caching and reverse proxy settings are very easy to configure.

*Dev Proxy is a command line tool for Mac and Linux.*

## Installation
Use NPM to install Dev Proxy for use on the command line globally:

    sudo npm install -g dev_proxy

## Full Documentation
Documentation is available on the project home page at http://www.kixx.name/projects/dev_proxy

## How it Works
Dev Proxy initializes a project by creating a hidden config file in your home directory, inside a hidden `~/.dev_proxy` directory, creating it if it does not already exist. It then reads the proxy server URI, target URI, file glob patterns, URL match patterns, and white list configurations from there. Example config files can be found in the 'examples/' directory.

Start Dev Proxy by moving into your project directory and running

    dev_proxy

That's it! Dev Proxy will create a config file for your project inside `~/.dev_proxy/` with the same name as your project folder. You might want to have a look at the config file to make some changes and restart Dev Proxy if you need to make any.

Once running, Dev Proxy will cache all HTTP requests (which have been whitelisted) in memory. When you make changes to one of your watched files or folders, Dev Proxy uses your configuration settings to 'bust' the appropriate cached HTTP URLs so those requests will get the latest versions on the next page load.

For more information, visit the [Dev Proxy home page](http://www.kixx.name/projects/dev_proxy).

Copyright and License
---------------------
Copyright: (c) 2014 by Kris Walker <kris@kixx.name> (http://www.kixx.name/)

Unless otherwise indicated, all source code is licensed under the MIT license. See MIT-LICENSE for details.

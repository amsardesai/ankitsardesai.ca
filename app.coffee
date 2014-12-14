
###
Module dependencies.
###
express = require 'express'
routes = require './routes'
http = require 'http'
path = require 'path'

autoprefixer = require 'express-autoprefixer'
less = require 'less-middleware'
coffee = require 'express-coffee'

app = express()

port = process.env.PORT or 3000
env = app.get("env")

# all environments
app.configure ->
  app.set 'port', port
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'
  app.use express.favicon("#{__dirname}/public/favicon.ico")
  app.use express.logger('dev')
  app.use express.bodyParser()
  app.use express.methodOverride()

  app.use autoprefixer
    browsers: 'last 2 versions'
    cascade: false
  app.use less
    src: "#{__dirname}/public"
    yuicompress: true
  app.use coffee
    path: "#{__dirname}/public"
    uglify: env == 'production'

  app.use express.static("#{__dirname}/public")
  app.use app.router

# development only
app.configure "development", ->
  app.use express.errorHandler()

routes app

app.listen port, ->
  console.log "ankitsardesai.ca running at port #{port} in #{env} mode"


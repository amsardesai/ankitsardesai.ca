# Base
express = require 'express'
connect = require 'connect-assets'
autoprefixer = require 'express-autoprefixer'

# Database
sqlite3 = require('sqlite3').verbose()

# Routes file
routes = require './routes'

# Initialize Express
exports.app = app = express()

# Determine port and environment
port = process.env.PORT or 3000
env = app.get 'env'

# Database connections
db = new sqlite3.Database(process.env.DB_URL)

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
    browsers: 'last 5 versions'
    cascade: false
  app.use connect()

  app.use express.static("#{__dirname}/public")
  app.use app.router

# development only
app.configure "development", ->
  app.use express.errorHandler()

routes app, express, db

app.listen port, ->
  console.log "ankitsardesai.ca running at port #{port} in #{env} mode"


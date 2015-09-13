# External modules
bodyParser = require 'body-parser'
bunyan = require 'bunyan'
bunyanExpress = require 'express-bunyan-logger'
connect = require 'connect-assets'
errorHandler = require 'errorhandler'
express = require 'express'
favicon = require 'serve-favicon'
methodOverride = require 'method-override'
sqlite = require 'sqlite3'

# Routes file
routes = require './routes'

# Initialize sqlite3
sqlite3 = sqlite.verbose()

# Initialize logging
log = bunyan.createLogger(name: 'ankitsardesai')

# Initialize express
app = express()

# Determine port and environment
port = process.env.PORT or 3000
env = process.env.NODE_ENV or 'development'

# Database connections
db = new sqlite3.Database(process.env.DB_URL)

# all environments
app.set 'views', "#{__dirname}/views"
app.set 'view engine', 'jade'
app.use favicon("#{__dirname}/public/favicon.ico")
app.use bodyParser.urlencoded(extended: true)
app.use methodOverride()
app.use bunyanExpress.errorLogger()
app.use connect()
app.use express.static("#{__dirname}/public")

# development only
if env == 'development'
  app.use errorHandler((err, str, req) -> log.error(str))

routes app, db, log

app.listen port, ->
  log.info 'ankitsardesai.ca running at port %s in %s mode', port, env


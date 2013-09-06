
###
Module dependencies.
###
express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")
app = express()

port = process.env.PORT or 3000
env = app.get("env")

# all environments
app.configure ->
	app.set "port", port
	app.set "views", __dirname + "/views"
	app.set "view engine", "jade"
	app.use express.favicon()
	app.use express.logger("dev")
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use require("less-middleware")(
		src: __dirname + "/public"
		yuicompress: true
	)
	app.use require("express-coffee")(
		path: __dirname + "/public"
		uglify: env is "production"
	)
	app.use express.static(__dirname + "/public")
	app.use app.router

# development only
app.configure "development", -> app.use express.errorHandler()

routes app

app.listen port, ->
	console.log "ankitsardesai.ca running at port " + port + " in " + env + " mode"


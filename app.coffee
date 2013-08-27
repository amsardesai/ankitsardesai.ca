
###
Module dependencies.
###
express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")
app = express()


# all environments
app.configure ->
	app.set "port", process.env.PORT or 3000
	app.set "views", __dirname + "/views"
	app.set "view engine", "jade"
	app.use express.favicon()
	app.use express.logger("dev")
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use require("less-middleware")(
		src: __dirname + "/public"
		yuicompress: app.get("env") is "production"
		force: app.get("env") is "development"
	)
	app.use require("express-coffee")(
		path: __dirname + "/public"
		uglify: app.get("env") is "production"
		live: app.get("env") is "development"
	)
	app.use express.static(__dirname + "/public")
	app.use app.router

# development only
app.configure "development", ->
	app.use express.errorHandler()

routes app

app.listen app.get("port"), ->
	console.log "ankitsardesai.ca running at port " + app.get("port") + " in " + app.get("env") + " mode"


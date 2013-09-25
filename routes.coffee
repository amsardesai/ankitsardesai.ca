# Routes file

module.exports = (app) ->
	# Universal Headers
	app.get "*", (req, res, next) -> 
		res.header "X-UA-Compatible", "IE=edge"
		next()

	app.get "/", (req, res) -> res.render "index"
	app.get "/resume", (req, res) -> res.sendfile __dirname + "/public/resume.pdf"
	app.get "*", (req, res) -> res.send "404", 404
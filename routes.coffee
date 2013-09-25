
#
# * GET home page.
# 

module.exports = (app) ->
	app.get "/", (req, res) -> res.render "index"
	app.get "/resume", (req, res) -> res.sendfile __dirname + "/public/resume.pdf"
	app.get "*", (req, res) -> res.send "404", 404
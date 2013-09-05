
#
# * GET home page.
# 

module.exports = (app) ->
	app.get "/", (req, res) -> res.render "index"
	app.get "*", (req, res) -> res.send "404", 404
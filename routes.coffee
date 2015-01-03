# Routes file

module.exports = (app, express) ->
  # Universal Headers
  app.get "*", (req, res, next) ->
    res.header "X-UA-Compatible", "IE=edge"
    next()

  app.get "/", (req, res) -> res.render "index"
  app.get "/resume", (req, res) -> res.sendfile __dirname + "/public/resume.pdf"

  auth = express.basicAuth (user, pass) ->
    user == process.env.ANKIT_ADMIN_USER &&
    pass == process.env.ANKIT_ADMIN_PASS
  app.get "/admin", auth, (req, res) -> res.render "admin"

  app.get "*", (req, res) -> res.send "404", 404

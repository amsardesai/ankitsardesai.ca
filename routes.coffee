# Routes file

module.exports = (app, express, db) ->
  # Universal Headers
  app.get '*', (req, res, next) ->
    res.header 'X-UA-Compatible', 'IE=edge'
    next()

  # Base site
  app.get '/', (req, res) -> res.render 'index'
  app.get '/resume', (req, res) -> res.sendfile "#{__dirname}/public/resume.pdf"

  # Authentication
  auth = express.basicAuth (user, pass) ->
    user == process.env.ANKIT_ADMIN_USER &&
    pass == process.env.ANKIT_ADMIN_PASS

  # Admin panel
  app.get '/admin', auth, (req, res) ->
    db.backgrounds.find (err, backgrounds) ->
      res.render 'admin', { backgrounds }

  # Background image operations
  app.post '/admin/background-image/create', auth, (req, res) ->
    console.log "CREATING BACKGROUND WITH:"
    console.log "  NAME: #{req.body.name}"
    console.log "  ORIGINAL URL: #{req.body.original_url}"
    console.log "  BLURRED URL: #{req.body.blurred_url}"
    console.log "  POSITION: #{req.body.position}"
    db.backgrounds.insert
      name: req.params.name
      original_url: req.body.original_url
      blurred_url: req.body.blurred_url
      position: req.body.position
    , (err) ->
      console.log err if err
      res.redirect '/admin'

  app.post '/admin/background-image/:id/update', auth, (req, res) ->
    console.log "UPDATING BACKGROUND #{req.params.id} WITH POSITION #{req.body.position}"
    db.backgrounds.update (name: req.params.name), ($set: (position: req.body.position)), (insert: false), (err) ->
      console.log err if err
      res.redirect '/admin'

  app.post '/admin/background-image/:id/delete', auth, (req, res) ->
    console.log "DELETING BACKGROUND #{req.params.id}"
    db.backgrounds.remove (name: req.params.name), (err) ->
      console.log err if err
      res.redirect '/admin'

  app.get '*', (req, res) -> res.send '404', 404

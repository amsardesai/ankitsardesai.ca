# Routes file

module.exports = (app, express, db) ->
  # Universal Headers
  app.get '*', (req, res, next) ->
    res.header 'X-UA-Compatible', 'IE=edge'
    next()

  # Main site
  app.get '/', (req, res) ->
    db.backgrounds.findOne
      random: $near: [Math.random(), 0]
    , (err, background) ->
      res.render 'index', { background }

  # Resume
  app.get '/resume', (req, res) -> res.sendfile "#{__dirname}/public/resume.pdf"

  # Authentication
  auth = express.basicAuth (user, pass) ->
    user == process.env.ANKIT_ADMIN_USER &&
    pass == process.env.ANKIT_ADMIN_PASS

  # Admin panel
  app.get '/admin', auth, (req, res) ->
    db.backgrounds.find (err, backgrounds) ->
      res.render 'admin', { backgrounds }

  # Find a random background image
  app.get '/db/backgrounds/random', (req, res) ->
    db.backgrounds.findOne
      random: $near: [Math.random(), 0]
      name: $not: $in: [req.query.previous]
    , (err, docs) ->
      if err
        console.log "Random function error: ", err
        res.json err: true
        return

      res.json
        name: docs.name
        original_url: docs.original_url
        blurred_url: docs.blurred_url
        position: docs.position
        photo_name: docs.photo_name
        location: docs.location

  # Background image operations
  app.post '/db/backgrounds/create', auth, (req, res) ->
    console.log "CREATING BACKGROUND WITH:"
    console.log "  NAME: #{req.body.name}"
    console.log "  POSITION: #{req.body.position}"
    db.backgrounds.insert
      name: req.body.name
      original_url: "http://cdn.ankitsardesai.ca/backgrounds/#{req.body.name}.jpg"
      blurred_url: "http://cdn.ankitsardesai.ca/backgrounds/#{req.body.name}-blurred.jpg"
      position: req.body.position
      random: [Math.random(), 0]
    , (err) ->
      console.log err if err
      res.redirect '/admin'

  app.post '/db/backgrounds/:name/update', auth, (req, res) ->
    console.log "UPDATING BACKGROUND #{req.params.name} WITH POSITION #{req.body.position}"
    db.backgrounds.update
      name: req.params.name
    ,
      $set:
        photo_name: req.body.photo_name
        location: req.body.location
        position: req.body.position
    ,
      insert: false
    , (err) ->
      console.log err if err
      res.redirect '/admin'

  app.post '/db/backgrounds/:name/delete', auth, (req, res) ->
    console.log "DELETING BACKGROUND #{req.params.name}"
    db.backgrounds.remove (name: req.params.name), (err) ->
      console.log err if err
      res.redirect '/admin'

  # Catch all for 404s
  app.get '*', (req, res) -> res.send '404', 404

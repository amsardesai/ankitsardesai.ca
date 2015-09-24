# Routes file

basicAuth = require 'basic-auth-connect'

module.exports = (app, db, log) ->

  # Main site
  app.get '/', (req, res) ->
    db.each 'SELECT * FROM backgrounds ORDER BY RANDOM() LIMIT 1', (err, row) ->
      res.render 'index',
        background:
          name: row.name
          photo_name: row.photo_name
          location: row.location
          position: row.position
          url: "//cdn.ankitsardesai.ca/backgrounds/#{row.name}.jpg"

  # Resume
  app.get '/resume', (req, res) ->
    res.sendFile "#{__dirname}/public/resume.pdf"

  # Authentication
  username = process.env.ANKIT_ADMIN_USER or 'ankit'
  password = process.env.ANKIT_ADMIN_PASS or 'password'
  auth = basicAuth (user, pass) -> user == username && pass == password

  # Admin panel
  app.get '/admin', auth, (req, res) ->

    db.all 'SELECT * FROM backgrounds', (err, rows) ->
      backgrounds = rows.map (row) ->
        name: row.name
        photo_name: row.photo_name
        location: row.location
        position: row.position
        url: "//cdn.ankitsardesai.ca/backgrounds/#{row.name}.jpg"

      res.render 'admin', { backgrounds }

  # Find a random background image
  app.get '/db/backgrounds/random', (req, res) ->
    previous = req.query.previous ? ""
    db.each 'SELECT * FROM backgrounds WHERE name != ? ORDER BY RANDOM() LIMIT 1', previous, (err, row) ->
      if err
        log.error "Random function error: ", err
        res.json
          err: true
      else
        res.json
          name: row.name
          photo_name: row.photo_name
          location: row.location
          position: row.position
          url: "//cdn.ankitsardesai.ca/backgrounds/#{row.name}.jpg"

  # Background image operations
  app.post '/db/backgrounds/create', auth, (req, res) ->
    log.info 'Creating background with'
    log.info '  name: %s', req.body.name
    log.info '  photo name: %s', req.body.photo_name
    log.info '  location: %s', req.body.location
    log.info '  position: %s', req.body.position

    db.run 'INSERT INTO backgrounds (name, photo_name, location, position) VALUES (?,?,?,?)',
      [req.body.name, req.body.photo_name, req.body.location, req.body.position], (err) ->
        log.error err if err
        res.redirect '/admin'

  app.post '/db/backgrounds/:name/update', auth, (req, res) ->
    log.info 'Updating background %s', req.params.name
    log.info '  photo name: %s', req.body.photo_name
    log.info '  location: %s', req.body.location
    log.info '  position: %s', req.body.position

    db.run 'UPDATE backgrounds SET photo_name=?, location=?, position=? WHERE name=?',
      [req.body.photo_name, req.body.location, req.body.position, req.params.name], (err) ->
        log.error err if err
        res.redirect '/admin'

  app.post '/db/backgrounds/:name/delete', auth, (req, res) ->
    log.info 'Deleting background %s', req.params.name

    db.run 'DELETE FROM backgrounds WHERE name=?',
      [req.params.name], (err) ->
        log.error err if err
        res.redirect '/admin'

  # Catch all for 404s
  app.get '*', (req, res) ->
    log.error 'Invalid URL: %s', req.url
    res.redirect '/'

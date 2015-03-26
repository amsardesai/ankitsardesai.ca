# Routes file

module.exports = (app, express, db) ->
  # Universal Headers
  app.get '*', (req, res, next) ->
    res.header 'X-UA-Compatible', 'IE=edge'
    next()

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
  app.get '/resume', (req, res) -> res.sendfile "#{__dirname}/public/resume.pdf"

  # Authentication
  auth = express.basicAuth (user, pass) ->
    user == process.env.ANKIT_ADMIN_USER &&
    pass == process.env.ANKIT_ADMIN_PASS

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
        console.log "Random function error: ", err
        res.json err: true
        return

      res.json
        name: row.name
        photo_name: row.photo_name
        location: row.location
        position: row.position
        url: "//cdn.ankitsardesai.ca/backgrounds/#{row.name}.jpg"

  # Background image operations
  app.post '/db/backgrounds/create', auth, (req, res) ->
    console.log "CREATING BACKGROUND WITH:"
    console.log "  NAME: #{req.body.name}"
    console.log "  PHOTO NAME: #{req.body.photo_name}"
    console.log "  LOCATION: #{req.body.location}"
    console.log "  POSITION: #{req.body.position}"

    db.run 'INSERT INTO backgrounds (name, photo_name, location, position) VALUES (?,?,?,?)',
      [req.body.name, req.body.photo_name, req.body.location, req.body.position], (err) ->
        console.log err if err
        res.redirect '/admin'

  app.post '/db/backgrounds/:name/update', auth, (req, res) ->
    console.log "UPDATING BACKGROUND #{req.params.name}:"
    console.log "  PHOTO NAME: #{req.params.photo_name}"
    console.log "  LOCATION: #{req.params.location}"
    console.log "  POSITION: #{req.params.position}"

    db.run 'UPDATE backgrounds SET name=?, photo_name=?, location=?, position=? WHERE name=?',
      [req.body.name, req.body.photo_name, req.body.location, req.body.position, req.params.name], (err) ->
        console.log err if err
        res.redirect '/admin'

  app.post '/db/backgrounds/:name/delete', auth, (req, res) ->
    console.log "DELETING BACKGROUND #{req.params.name}"

    db.run 'DELETE FROM backgrounds WHERE name=?',
      [req.params.name], (err) ->
        console.log err if err
        res.redirect '/admin'

  # Catch all for 404s
  app.get '*', (req, res) -> res.send '404', 404

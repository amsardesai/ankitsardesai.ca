# jQuery configuration
jQuery.fx.interval = 29

class PhotoViewer
  # UI hash
  ui:
    showPhotos: _.memoize => $('.show-photos')

  # Initialization
  init: ->



class BackgroundImageSwitcher
  # UI hash
  ui:
    backgrounds:    _.memoize => $('.backgrounds')
    mainBackground: _.memoize => $('.backgrounds .main')

  # Get the next image
  getNextImage: (callback) ->
    $.getJSON "/db/backgrounds/random?previous=#{@currentImage}", (data) ->
      callback(data) unless data.err

  # Initialization
  init: ->
    @currentImage = @ui.backgrounds().data('bg-initial')
    @preloadNextImage()
    setInterval ( => @animateToNextImage() ), 8000

  # Inserts an element representing the next image
  preloadNextImage: ->
    @getNextImage (nextBackground) =>
      @currentImage = nextBackground.name
      @ui.mainBackground().append $("<div class='background next'>").css
        'background-image': "url('#{nextBackground.original_url}')"
        'background-position': nextBackground.position

  # Animates to the next image in cache
  animateToNextImage: ->
    previousBackground = @ui.backgrounds().find('.background:not(.next)')
    @ui.backgrounds().find('.background.next').removeClass('next')
    _.delay ( =>
      previousBackground.remove()
      @preloadNextImage()
    ), 2000

class SpecialEffects
  # UI Hash
  ui:
    socialIcons: _.memoize => $('#top .icons a')

  # Initialization
  init: ->
    @ui.socialIcons().tooltip(placement: 'bottom', html: 'true') unless Modernizr.touch

class GoogleAnalytics
  # Initialization
  init: ->
    $('#top .icons a').click (e) =>
      @sendGA 'button', 'click', $(e.currentTarget).data('ga-label')

    $('#top .arrow-down').click =>
      @sendGA 'button', 'click', 'Down Arrow'

  # Send a GA event
  sendGA: (category, action, label) ->
    try ga 'send', 'event', category, action, label catch

$ ->
  (new PhotoViewer).init()
  (new BackgroundImageSwitcher).init()
  (new SpecialEffects).init()
  (new GoogleAnalytics).init()

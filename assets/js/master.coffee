
class PhotoViewer
  # UI hash
  ui:
    mainBox:     _.memoize => $('.main-box')
    showPhotos:  _.memoize => $('.show-photos')
    backgrounds: _.memoize => $('.backgrounds')

  # Whether photo viewer is enabled
  enabled: false

  # Initialization
  init: ->
    @ui.showPhotos().click =>
      @enabled = !@enabled
      @reloadState()


    @reloadState()

  # Reload screen state depending on instance variables
  reloadState: ->
    @ui.showPhotos().toggleClass('enabled', @enabled)
    @ui.mainBox().toggleClass('hide-box', @enabled)
    @ui.backgrounds().toggleClass('show-details', @enabled)

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
      nextImage = $("<div class='background next'>").css
        'background-image': "url('#{nextBackground.original_url}')"
        'background-position': nextBackground.position
      photoDetails = $("<div class='photo-details'>")
        .append($("<div class='name'>").text(nextBackground.photo_name))
        .append($("<div class='location'>").text(nextBackground.location))
      nextImage.append photoDetails
      @ui.mainBackground().append nextImage

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
    showPhotos:  _.memoize => $('.show-photos')

  # Initialization
  init: ->
    unless Modernizr.touch
      @ui.socialIcons().tooltip(placement: 'bottom', html: 'true')

class GoogleAnalytics
  # Initialization
  init: ->
    $('#top .icons a').click (e) =>
      @sendGA 'button', 'click', $(e.currentTarget).data('ga-label')

    $('.show-photos').click =>
      @sendGA 'button', 'click', 'Show Photo'

  # Send a GA event
  sendGA: (category, action, label) ->
    try ga 'send', 'event', category, action, label catch

$ ->
  (new PhotoViewer).init()
  (new BackgroundImageSwitcher).init()
  (new SpecialEffects).init()
  (new GoogleAnalytics).init()

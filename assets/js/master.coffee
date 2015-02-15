
class PhotoViewer
  # UI hash
  ui:
    mainBox:     _.memoize => $('.main-box')
    showPhotos:  _.memoize => $('.show-photos')
    backgrounds: _.memoize => $('.backgrounds')

  # Initialization
  init: ->
    @ui.showPhotos().on "#{if Modernizr.touch then 'touchstart' else ''} click", (e) =>
      e.preventDefault()
      e.stopPropagation()
      @toggleEnable()
      @reloadState()

    @reloadState()

  # Reload screen state depending on instance variables
  reloadState: ->
    @ui.showPhotos().toggleClass('enabled', @enabled())
    @ui.mainBox().toggleClass('hide-box', @enabled())
    @ui.backgrounds().toggleClass('show-details', @enabled())

  # Toggle photo viewer state
  toggleEnable: ->
    @_enabled = if @_enabled? then !@_enabled else true

  # Get photo viewer state
  enabled: -> @_enabled ? false

class BackgroundImageSwitcher
  # UI hash
  ui:
    backgrounds: _.memoize => $('.backgrounds')
    bgTemplate:  _.memoize => _.template($('#tpl-background').html())

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
      template = @ui.bgTemplate()(nextBackground)
      @ui.backgrounds().append template

  # Animates to the next image in cache
  animateToNextImage: ->
    previousBackground = @ui.backgrounds().find('.background:not(.next)')
    previousDetails = @ui.backgrounds().find('.photo-details:not(.next)')
    @ui.backgrounds().find('.next').removeClass('next')
    previousDetails.addClass('previous')
    _.delay ( =>
      previousDetails.remove()
    ), 300
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
    $('#top .icons a').on 'click', (e) =>
      @sendGA 'button', 'click', $(e.currentTarget).data('ga-label')

    $('.show-photos').on 'touchstart click',  =>
      @sendGA 'button', 'click', 'Show Photo'

  # Send a GA event
  sendGA: (category, action, label) ->
    try ga 'send', 'event', category, action, label catch

$ ->
  (new PhotoViewer).init()
  (new BackgroundImageSwitcher).init()
  (new SpecialEffects).init()
  (new GoogleAnalytics).init()

# jQuery configuration
jQuery.fx.interval = 29

class ParallaxBlur
  # How far down the page user has to go for element to disappear
  THRESHOLD:
    BLUR: (2 / 3)
    TOP: (1 / 2)

  # How much delay there should be between updateOpacity calls
  THROTTLE:
    TOUCH: 131
    REGULAR: 67

  # UI hash
  ui:
    window:         _.memoize => $(window)
    blurBackground: _.memoize => $('.backgrounds .blur')
    topSection:     _.memoize => $('#top')
    arrowDown:      _.memoize => $('#top .arrow-down')
    projectSection: _.memoize => $('#projects')

  # Initialization
  init: ->
    @updateOpacity()
    @ui.window().on 'resize scroll', _.throttle(( => @updateOpacity() ), if Modernizr.touch then @THROTTLE.TOUCH else @THROTTLE.REGULAR)

    @ui.arrowDown().click (e) ->
      e.preventDefault()
      $('html, body').animate (scrollTop: $('#top').height()), 1000

    @ui.projectSection().find('hr').css(width: 0)
    @ui.projectSection().find('h1, .intro, .projects, .outro').css(opacity: 0)
    @ui.projectSection().waypoint (dir) ->
      $(@).find('hr').delay(100).animate width: '100%', 400, =>
        $(@).find('h1, .intro').animate(opacity: 1, 400)
        $(@).find('.projects').delay(300).animate(opacity: 1, 500)
        $(@).find('.outro').delay(600).animate(opacity: 1, 500)
    , (offset: '85%')

  # Update opacity on scroll
  updateOpacity: ->
    ratio = @ui.window().scrollTop() / @ui.window().height()
    blurOpacity = Math.max(0, Math.min(1, ratio / @THRESHOLD.BLUR))
    topOpacity = 1 - Math.max(0, Math.min(1, ratio / @THRESHOLD.TOP))
    @ui.blurBackground().css 'opacity', blurOpacity
    @ui.topSection().css 'opacity', topOpacity

class BackgroundImageSwitcher
  # UI hash
  ui:
    backgrounds:    _.memoize => $('.backgrounds')
    mainBackground: _.memoize => $('.backgrounds .main')
    blurBackground: _.memoize => $('.backgrounds .blur')

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
      @ui.blurBackground().append $("<div class='background next'>").css
        'background-image': "url('#{nextBackground.blurred_url}')"
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
    arrowDown:   _.memoize => $('#top .arrow-down')
    socialIcons: _.memoize => $('#top .icons a')

  # Initialization
  init: ->
    @ui.socialIcons().tooltip(placement: 'bottom', html: 'true') unless Modernizr.touch
    @ui.arrowDown().css('opacity', 0).delay(500).animate(opacity: 1, 500)

class GoogleAnalytics
  # Initialization
  init: ->
    $('#top .icons a').click (e) =>
      @sendGA 'button', 'click', $(e.currentTarget).data('ga-label')

    $('#top .arrow-down').click =>
      @sendGA 'button', 'click', 'Down Arrow'

    $('#projects .projects a').click (e) =>
      @sendGA 'button', 'click', $(e.currentTarget).data('ga-label')

    $('#projects').waypoint (dir) =>
      @sendGA 'page', 'scroll', 'Projects Section'
    , offset: '85%', triggerOnce: true

    $('#projects').waypoint (dir) =>
      @sendGA 'page', 'scroll', 'Bottom of Page'
    , offset: 'bottom-in-view', triggerOnce: true

  # Send a GA event
  sendGA: (category, action, label) ->
    try ga 'send', 'event', category, action, label catch

$ ->
  (new ParallaxBlur).init()
  (new BackgroundImageSwitcher).init()
  (new SpecialEffects).init()
  (new GoogleAnalytics).init()

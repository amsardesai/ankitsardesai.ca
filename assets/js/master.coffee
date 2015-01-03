
class ParallaxBlur
  # How far down the page user has to go for element to disappear
  THRESHOLD:
    BLUR: (2 / 3)
    TOP: (1 / 2)

  # How much delay there should be between updateOpacity calls
  THROTTLE:
    TOUCH: 130
    REGULAR: 90

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
  # List of backgrounds
  backgrounds: [
    (name: 'cntower', position: 'top')
    (name: 'towers', position: 'center')
    (name: 'pillars', position: 'bottom')
    (name: 'terminal', position: 'top')
    (name: 'delta', position: 'center')
    (name: 'spadina', position: 'bottom')
    (name: 'kingwest', position: 'bottom')
    (name: 'fashionhouse', position: 'center')
    (name: 'ctv', position: 'top')
    (name: 'ago', position: 'bottom')
    (name: 'uc', position: 'center')
    (name: 'medsci', position: 'center')
    (name: 'whitneyblock', position: 'center')
    (name: 'baystnorth', position: 'top')

  ]

  # UI hash
  ui:
    mainBackground: _.memoize => $('.backgrounds .main')
    blurBackground: _.memoize => $('.backgrounds .blur')

  # Various getters
  getNextImageIndex: -> (@currentImageIndex + 1) % @backgrounds.length
  getCurrentImage: -> @backgrounds[@currentImageIndex]
  getNextImage: -> @backgrounds[@getNextImageIndex()]
  incrementImageIndex: -> @currentImageIndex = @getNextImageIndex()

  # Initialization
  init: ->
    @backgrounds = _.shuffle @backgrounds
    @currentImageIndex = Math.floor(Math.random() * @backgrounds.length)
    currentBackground = @getCurrentImage()
    @ui.mainBackground().find('.background').css
      'background-image': "url('/images/#{currentBackground.name}.jpg')"
      'background-position': currentBackground.position
    @ui.blurBackground().find('.background').css
      'background-image': "url('/images/#{currentBackground.name}-blurred.jpg')"
      'background-position': currentBackground.position
    @preloadNextImage()
    setInterval ( => @animateToNextImage() ), 8000

  # Inserts an element representing the next image
  preloadNextImage: ->
    nextBackground = @getNextImage()
    newMainBackground = $("<div class='background next'>").css
        opacity: 0
        'background-image': "url('/images/#{nextBackground.name}.jpg')"
        'background-position': nextBackground.position
    newBlurBackground = $("<div class='background next'>").css
        opacity: 0
        'background-image': "url('/images/#{nextBackground.name}-blurred.jpg')"
        'background-position': nextBackground.position
    @ui.mainBackground().append newMainBackground
    @ui.blurBackground().append newBlurBackground

  # Animates to the next image in cache
  animateToNextImage: ->
    postAnimation = _.after 2, => @postAnimation()
    @ui.mainBackground().find('.background.next').animate (opacity: 1), 2000, postAnimation
    @ui.blurBackground().find('.background.next').animate (opacity: 1), 2000, postAnimation

  # After animation has been performed
  postAnimation: ->
    @ui.mainBackground().find('.background:not(.next)').remove()
    @ui.blurBackground().find('.background:not(.next)').remove()
    @ui.mainBackground().find('.background').removeClass('next')
    @ui.blurBackground().find('.background').removeClass('next')
    @incrementImageIndex()
    @preloadNextImage()

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

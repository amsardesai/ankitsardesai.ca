# ankitsardesai.ca


class BackgroundImageSwitcher
  # List of backgrounds
  BACKGROUNDS: [
    'cntower'
    'towers'
  ]

  # UI hash
  ui:
    mainBackground: _.memoize => $('.backgrounds .main')
    blurBackground: _.memoize => $('.backgrounds .blur')

  # Various getters
  getNextImageIndex: -> (@currentImageIndex + 1) % @BACKGROUNDS.length
  getCurrentImageName: -> @BACKGROUNDS[@currentImageIndex]
  getNextImageName: -> @BACKGROUNDS[@getNextImageIndex()]
  incrementImageIndex: -> @currentImageIndex = @getNextImageIndex()

  # Initialization
  init: ->
    @currentImageIndex = Math.floor(Math.random() * @BACKGROUNDS.length)
    @ui.mainBackground().find('.background').css 'background-image', "url('/images/#{@BACKGROUNDS[@currentImageIndex]}.jpg')"
    @ui.blurBackground().find('.background').css 'background-image', "url('/images/#{@BACKGROUNDS[@currentImageIndex]}-blurred.jpg')"
    @preloadNextImage()
    setInterval ( => @animateToNextImage() ), 8000

  # Inserts an element representing the next image
  preloadNextImage: ->
    newMainBackground = $("<div class='background next'>").css(opacity: 0, 'background-image': "url('/images/#{@getNextImageName()}.jpg')")
    newBlurBackground = $("<div class='background next'>").css(opacity: 0, 'background-image': "url('/images/#{@getNextImageName()}-blurred.jpg')")
    @ui.mainBackground().append newMainBackground
    @ui.blurBackground().append newBlurBackground

  # Animates to the next image in cache
  animateToNextImage: ->
    asyncPostAnimation = _.after 2, ( => @postAnimation() )
    @ui.mainBackground().find('.background.next').animate (opacity: 1), 2000, asyncPostAnimation
    @ui.blurBackground().find('.background.next').animate (opacity: 1), 2000, asyncPostAnimation

  # After animation has been performed
  postAnimation: ->
    @ui.mainBackground().find('.background:not(.next)').remove()
    @ui.blurBackground().find('.background:not(.next)').remove()
    @ui.mainBackground().find('.background').removeClass('next')
    @ui.blurBackground().find('.background').removeClass('next')
    @incrementImageIndex()
    @preloadNextImage()


$ ->

  backgrounds = $('.backgrounds')
  mainBackground = backgrounds.find('.main')
  blurBackground = backgrounds.find('.blur')
  topSection = $('#top')
  socialIcons = $('#top .icons a')
  arrowDown = $('#top .arrow-down')
  projectSection = $('#projects')

  # Inside #name
  if not Modernizr.touch
    socialIcons.tooltip
      placement: 'bottom'
      html: true

  (new BackgroundImageSwitcher).init()

  # How fast the opacity should change
  BLUR_THRESHOLD = 2 / 3
  TOP_THRESHOLD = 1 / 2

  # Blurring effect
  (effect = ->
    ratio = $(window).scrollTop() / $(window).height()
    blurOpacity = Math.max(0, Math.min(1, ratio / BLUR_THRESHOLD))
    topOpacity = 1 - Math.max(0, Math.min(1, ratio / TOP_THRESHOLD))
    blurBackground.css 'opacity', blurOpacity
    topSection.css 'opacity', topOpacity
  )()
  $(window).on 'resize scroll', _.throttle(effect, if Modernizr.touch then 100 else 50)

  # Arrow fading in
  arrowDown
    .css('opacity', 0)
    .click (e) ->
      e.preventDefault()
      $('html, body').animate(scrollTop: $('#top').height(), 1000)
    .delay(500)
    .animate(opacity: 1, 500)

  # Items in Projects section fading in
  projectSection
    .find('hr').css(width: 0).end()
    .find('h1, .intro, .projects, .outro').css(opacity: 0).end()
    .waypoint ((dir) ->
      $(@).find('hr').delay(100).animate width: '100%', 400, =>
        $(@).find('h1, .intro').animate(opacity: 1, 400)
        $(@).find('.projects').delay(300).animate(opacity: 1, 500)
        $(@).find('.outro').delay(600).animate(opacity: 1, 500)
    ), (offset: '85%')

  # Google Analytics
  socialIcons.click -> try ga 'send', 'event', 'button', 'click', $(this).data('ga-label') catch
  arrowDown.click -> try ga 'send', 'event', 'button', 'click', 'Down Arrow' catch
  projectSection.waypoint ((dir) -> try ga 'send', 'event', 'page', 'scroll', 'Projects Section' catch), (offset: '85%', triggerOnce: true)
  projectSection.waypoint ((dir) -> try ga 'send', 'event', 'page', 'scroll', 'Bottom of Page' catch), (offset: 'bottom-in-view', triggerOnce: true)

# ankitsardesai.ca

BACKGROUNDS = [
  'cntower'
  'towers'
]

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

  # Image initialization
  currentImage = Math.floor(Math.random() * BACKGROUNDS.length)
  mainBackground.find('.background').css 'background-image', "url('/images/#{BACKGROUNDS[currentImage]}.jpg')"
  blurBackground.find('.background').css 'background-image', "url('/images/#{BACKGROUNDS[currentImage]}-blurred.jpg')"

  # Image switching
  setInterval ( ->
    currentImage = (currentImage + 1) % BACKGROUNDS.length
    currentMainBackground = mainBackground.find('.background')
    currentBlurBackground = blurBackground.find('.background')
    newMainBackground = $("<div class='background'>").css(opacity: 0, 'background-image': "url('/images/#{BACKGROUNDS[currentImage]}.jpg')")
    newBlurBackground = $("<div class='background'>").css(opacity: 0, 'background-image': "url('/images/#{BACKGROUNDS[currentImage]}-blurred.jpg')")
    mainBackground.append newMainBackground
    blurBackground.append newBlurBackground
    newMainBackground.animate (opacity: 1), 2000, -> currentMainBackground.remove()
    newBlurBackground.animate (opacity: 1), 2000, -> currentBlurBackground.remove()
  ), 8000

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

$ ->
  # Inside #name
  if not Modernizr.touch
    $('#top .icons a').tooltip
      placement: 'bottom'
      html: true

  blurBackground = $('.blur-background')

  topSection = $('#top')
  arrowDown = $('#top .arrow-down')
  aboutSection = $('#about')
  projectSection = $('#projects')

  # How fast the opacity should change
  BLUR_THRESHOLD = 2 / 3
  TOP_THRESHOLD = 1 / 2

  (effect = ->
    ratio = $(window).scrollTop() / $(window).height()
    if ratio < 1
      blurOpacity = ratio / BLUR_THRESHOLD
      topOpacity = 1 - ratio / TOP_THRESHOLD
      blurBackground.css 'opacity', blurOpacity
      topSection.css 'opacity', topOpacity
  )()
  $(window).on 'resize scroll', _.throttle(effect, 50)

  arrowDown
    .css('opacity', 0)
    .click (e) ->
      e.preventDefault()
      $('html, body').animate(scrollTop: $('#top').height(), 1000)
    .delay(500)
    .animate(opacity: 1, 500)

  projectSection
    .find('hr').css(width: 0).end()
    .find('h1, .intro, .projects, .outro').css(opacity: 0).end()

$(window).load ->
  aboutSection = $('#about')
  projectSection = $('#projects')

  projectSection
    .waypoint ((dir) ->
      $(@).find('hr').delay(100).animate width: '100%', 400, =>
        $(@).find('h1, .intro').animate(opacity: 1, 400)
        $(@).find('.projects').delay(300).animate(opacity: 1, 500)
        $(@).find('.outro').delay(600).animate(opacity: 1, 500)
    ), (offset: '85%')


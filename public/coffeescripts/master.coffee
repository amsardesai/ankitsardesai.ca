$ ->
  # Inside #name
  if not Modernizr.touch
    $('#top .icons a').tooltip
      placement: 'bottom'
      html: true

  blurBackground = $('.blur-background')

  topSection = $('#top')
  arrowDown = $('#top .arrow-down')
  projectSection = $('#projects')

  # How fast the opacity should change
  BLUR_THRESHOLD = 2 / 3
  TOP_THRESHOLD = 1 / 2

  (effect = ->
    ratio = $(window).scrollTop() / $(window).height()
    blurOpacity = Math.max(0, Math.min(1, ratio / BLUR_THRESHOLD))
    topOpacity = 1 - Math.max(0, Math.min(1, ratio / TOP_THRESHOLD))
    blurBackground.css 'opacity', blurOpacity
    topSection.css 'opacity', topOpacity
  )()
  $(window).on 'resize scroll', _.throttle(effect, if Modernizr.touch then 100 else 50)

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
    .waypoint ((dir) ->
      $(@).find('hr').delay(100).animate width: '100%', 400, =>
        $(@).find('h1, .intro').animate(opacity: 1, 400)
        $(@).find('.projects').delay(300).animate(opacity: 1, 500)
        $(@).find('.outro').delay(600).animate(opacity: 1, 500)
    ), (offset: '85%')


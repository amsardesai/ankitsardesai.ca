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
  projectsHeader = $('#projects h3')

  # How fast the opacity should change
  BLUR_THRESHOLD = 2 / 3
  TOP_THRESHOLD = 1 / 2

  (effect = ->
    ratio = $(window).scrollTop() / $(window).height()
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
      $('html, body').animate(scrollTop: $('#top').height(), 600)
    .delay(500)
    .animate(opacity: 1, 500)


  projectSection
    .find('hr.animate-waypoint').css(width: 0, visibility: 'hidden').end()
    .find('ul.projects li').css(opacity: 0).end()
    .waypoint ((dir) ->
      $(@).find('hr.animate-waypoint').css(visibility: 'visible').animate width: '100%', 400, =>
        $(@).find('ul.projects li').each (i) ->
          $(@).delay(200).delay(150 * i).animate(opacity: 0.8, 500)
    ), (offset: '95%')


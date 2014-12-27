range = (min, max, val) ->  Math.max(min, Math.min(max, val))

INITIAL_OPACITY = 0.8

$ ->
  # Inside #name
  $('#name .icons a').tooltip
    placement: 'top'
    html: true

  if not Modernizr.touch
    mainBox = $('.main-box').css(opacity: INITIAL_OPACITY)
    parallaxElement = $('.parallax')

    (parallax = ->
      windowHeight = $(window).height()
      windowScrollTop = $(window).scrollTop()
      if windowScrollTop < windowHeight
        mainBox.css(opacity: range(0, 1, INITIAL_OPACITY - (windowScrollTop / windowHeight)))
    )()
    $(window).on "resize scroll", parallax


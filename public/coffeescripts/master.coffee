parallaxCity = true
parallaxCityFactor = 0.12
parallaxCitySkylineFactor = 0.24

delay = 200

getScrollPos = (element) -> 
	offset = $(element).position().top - 50
	scrollpos = $(window).scrollTop() + offset
	scrollpos = offset if $(window).scrollTop() < 0
	return scrollpos

$ ->
	# Header
	$("header a").tooltip(placement: "bottom")

	# About Me Animations
	$("#aboutme h3").
		css(opacity: 0).
		animate((opacity: 1), 1000).
		click -> 
			parallaxCity = false
			$("#aboutme .container").fadeOut 500
	$("#aboutme .hidden-paragraphs p").
		css(opacity: 0).
		delay(delay).
		each (i) -> $(this).delay(i*150).animate (opacity: 1, left: 0), 700
	$("#aboutme .buildings").
		delay(delay).
		animate (bottom: 0), (
			duration: 500
			step: (now,fx) -> if not Modernizr.touch then fx.end = getScrollPos("#aboutme") * -parallaxCityFactor
		)
	$("#aboutme .city").
		delay(delay).
		animate (bottom: 0), (
			duration: 800
			step: (now,fx) -> if not Modernizr.touch then fx.end = getScrollPos("#aboutme") * -parallaxCitySkylineFactor
			complete: -> 
				if not Modernizr.touch then $(window).bind "scroll", ->
					if parallaxCity
						scrolled = getScrollPos("#aboutme")
						scrolled = 0 if scrolled < 0
						$("#aboutme .buildings").
							css (bottom: scrolled * -parallaxCityFactor)
						$("#aboutme .city").
							css (bottom: scrolled * -parallaxCitySkylineFactor)
		)


	# Projects Animations
	if not Modernizr.touch
		$("#projects h1, #projects p, #projects .list").
			css(opacity: 0).
			delay(delay*4).
			waypoint ((dir) ->
				$(this).delay(delay).
					animate (opacity: 1), 500
			), (offset: "95%")


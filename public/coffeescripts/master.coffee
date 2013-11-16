parallaxCityFactor = 0.11
parallaxSkylineFactor = 2.2

getScrollPos = (element) -> 
	offset = $(element).position().top - 50
	scrollpos = $(window).scrollTop() + offset
	scrollpos = offset if $(window).scrollTop() < 0
	scrollpos

$ ->
	# About Me Animations
	delay = 200
	$("#aboutme h3").
		css(opacity: 0).
		animate (opacity: 1), 1000
	$("#aboutme .hidden-paragraphs p").
		css(opacity: 0).
		delay(delay).
		each (i) -> $(this).delay(i*150).animate (opacity: 1, left: 0), 700
	$("#aboutme .buildings").
		delay(delay*2).
		animate (bottom: 0), (
			duration: 400
			step: (now,fx) -> if not Modernizr.touch then fx.end = getScrollPos("#aboutme") * -parallaxCityFactor
		)
	$("#aboutme .city").
		delay(delay*2).
		animate (bottom: 0), (
			duration: 600
			step: (now,fx) -> if not Modernizr.touch then fx.end = getScrollPos("#aboutme") * -parallaxCityFactor * parallaxSkylineFactor
			complete: -> 
				if not Modernizr.touch then $(window).bind "scroll", ->
					scrolled = getScrollPos("#aboutme")
					scrolled = 0 if scrolled < 0
					$("#aboutme .buildings").
						css (bottom: -scrolled * parallaxCityFactor)
					$("#aboutme .city").
						css (bottom: -scrolled * parallaxCityFactor * parallaxSkylineFactor)
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

		$("header a").tooltip(placement: "bottom")

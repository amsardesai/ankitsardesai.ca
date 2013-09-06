$ ->

	# About Me Animations
	delay = 200
	$("#aboutme h3").
		css(opacity: 0).
		#delay(delay).
		animate (opacity: 1), 1000
	$("#aboutme .hidden-paragraphs p").
		css(opacity: 0, left: -100).
		delay(delay*2).
		each (i) -> $(this).delay(i*150).animate (opacity: 1, left: 0), 400
	$("#aboutme .buildings").
		delay(delay*4).
		animate ("bottom": 0), 600
	$("#aboutme .city").
		delay(delay*4).
		animate ("bottom": 0), 1000

	# Projects Animations
	$("#projects h1, #projects p, #projects .list").
		css(opacity: 0).
		waypoint ((dir) ->
			$(this).
				delay(delay).
				animate (opacity: 1), 500
		), (offset: "95%")
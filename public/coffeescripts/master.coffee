$ ->
	# Preliminary Animations
	$("#aboutme .buildings").animate ("bottom": 0), 400
	$("#aboutme .city").animate ("bottom": 0), 700
	$("#aboutme .hidden-paragraphs li").
		css(opacity: 0, left: -100).
		each (i) -> $(this).delay(i*50).animate (opacity: 1, left: 0), 300
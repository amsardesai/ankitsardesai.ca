$ ->
	# Preliminary Animations
	$("#aboutme .buildings").animate ("bottom": 0), 400
	$("#aboutme .city").animate ("bottom": 0), 700
	$("#aboutme .hidden-paragraphs p").
		css(opacity: 0, left: -100).
		each (i) -> $(this).delay(i*75).animate (opacity: 1, left: 0), 300
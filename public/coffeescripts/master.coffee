$ ->
	# Preliminary Animations
	$("#aboutme .buildings").animate ("bottom": 0), 400
	$("#aboutme .city").animate ("bottom": 0), 700
	$("#aboutme .hidden-paragraphs p").
		css(opacity: 0, left: -100).
		each (i) -> $(this).delay(i*75).animate (opacity: 1, left: 0), 300
	# $("#projects .list a").each (i) ->
	# 	$(this).css(
	# 		left: if i % 2 is 0 then -100 else 100
	# 		opacity: 0
	# 	).waypoint( (direction) -> 
	# 		$(this).animate (opacity: 1, left: 0), 300
	# 	, (offset: "90%"))
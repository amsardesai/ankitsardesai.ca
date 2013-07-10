/* Written by Ankit Sardesai */

$("html").addClass("js"); // Fixed flashing bug in IE

var touchSupport = Modernizr.touch;
var transitionSupport = Modernizr.csstransitions;
var curSlide, hp=0;

// Startup function
$(document).ready(function() {
	$("#wrapper").addClass("initialHide");
	$("#menuItems li").addClass("animationReset");
	$("#container").wrapInner($("<div>").attr("id","slider"));
	$("#wrapper .body").attr("id","");
	$("#arrow").append($("<div>").attr("id","box"));
	$("#wrapper").fadeIn(500, function() {
		$("#box").delay(300).fadeIn(250);
		$("#menuItems li").each(function(index) {
			var delay = 100 * index;
			var opacity = 1;
			$(this).delay(delay).animate({
				opacity: opacity,
				top: '0'
			}, 300, 'linear', function() {
				$(this).css({
					position: "",
					filter: ""
				});
			});
		});
	});
	$(window).on("resize",function(){reHeight(100);});
	if (touchSupport) {
		centerslider.bindTouches($("#slider"));
		$("#menuItems a").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
	}
	$(window).hashchange(refreshPages);
	$(window).hashchange();
	if(!Modernizr.svg) $('img[src*="svg"]').attr('src', function() {
		return $(this).attr('src').replace('.svg', '.png');
	});
});

// Animate height of wrapper to correct height
function reHeight(d) {
	var hn = $("#wrapper .body").eq(curSlide).outerHeight();
	if (hn!=hp) {
		if (transitionSupport) $("#container").css("height",hn);
		else $("#container").stop().animate({height:hn},d);
	}
	hp = hn;
}

// Change the slide of the page to correct slide
function changeSlide() {
	var slidedelay = 300;
	if (transitionSupport) {
		$("#slider").css("left",-100*curSlide+"%");
		$("#box").css("left",(100/3)*curSlide+"%");
	} else {
		$("#slider").animate({left:-100*curSlide+"%"},slidedelay);
		$("#box").animate({left:(100/3)*curSlide+"%"},slidedelay);
	}
	reHeight(slidedelay);
	var t = curSlide==2? "Contact Me!" : curSlide==1? "Projects" : "About";
	document.title = t + " - Ankit Sardesai";
}

// Determine which slide the page should be changed to depending on the location hash
function refreshPages() {
	var hash = window.location.hash;
	if (hash=="#projects") curSlide = 1;
	else if (hash=="#contact") curSlide = 2;
	else curSlide = 0;
	changeSlide();
}

/**
 * Begin Slider Code
 * Created by Ankit Sardesai
 */

centerslider = {
	bindTouches: function(frame) {
		centerslider.menu = $("#wrapper #arrow #box");
		frame.bind("touchstart",function(e) {
			centerslider.startT($(this),e);
			centerslider.firstTouch = true;
			centerslider.canMove = false;
			return true;
		}).bind("touchmove",function(e) {
			if (centerslider.firstTouch && !centerslider.canMove) {
				var diffX = Math.abs(e.originalEvent.touches.item(0).clientX - centerslider.startX);
				var diffY = Math.abs(e.originalEvent.touches.item(0).clientY - centerslider.startY);
				centerslider.canMove = diffY < diffX;
				centerslider.firstTouch = false;
				return !centerslider.canMove;
			} else if (centerslider.canMove) {
				centerslider.moving = true;
				centerslider.moveT($(this),e);
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else return true;
		}).bind("touchend",function(e) {
			if (centerslider.moving) {
				centerslider.moving = false;
				centerslider.endT($(this),e);
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else return true;
		});
	},
	startT: function(item,e) {
		item.add(centerslider.menu).addClass("sliding").stop();
		centerslider.startX = e.originalEvent.touches.item(0).clientX;
		centerslider.startY = e.originalEvent.touches.item(0).clientY;
		centerslider.startLeft = parseInt(item.css("left"),10);
	},
	moveT: function(item,e) {
		centerslider.movement = e.originalEvent.touches.item(0).clientX - centerslider.startX;
		var newLeft = centerslider.startLeft + centerslider.movement;
		var rightbound = -item.width() * 2/3;
		if (newLeft > 0) newLeft /= 2;
		else if (newLeft < rightbound) newLeft = (newLeft - rightbound)/2 + rightbound;
		var newItemLeft = newLeft / item.parent().width() * 100;
		var newMenuLeft = - newLeft / centerslider.menu.parent().width() * (100/3);
		item.css("left",newItemLeft + "%");
		centerslider.menu.css("left",newMenuLeft + "%");
	},
	endT: function(item,e) {
		item.add(centerslider.menu).removeClass("sliding");
		var goingLeft = (centerslider.movement > 0);
		var threshold = 50;
		if (goingLeft && curSlide > 0 && centerslider.movement > threshold) curSlide--;
		else if (!goingLeft && curSlide < 2 && centerslider.movement < -threshold) curSlide++;
		changeSlide();
	}
};





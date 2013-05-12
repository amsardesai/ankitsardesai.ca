/* Written by Ankit Sardesai */

// Google Analytics

var _gaq = _gaq || [];
var pluginUrl =  '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
_gaq.push(['_setAccount', 'UA-37589348-1']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Main Javascript

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
			var opacity = 0.7;
			$(this).delay(delay).animate({
				opacity: opacity,
				top: '0'
			}, 300, 'linear');
		});
	});
	$(window).on("resize",function(){reHeight(100);});
	if (touchSupport) {
		fslider.touchSlider($("#slider"));
		$("#menuItems a").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
	}
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

// Animate height of wrapper to correct height
function reHeight(d) {
	var hn = $("#wrapper .body").eq(curSlide).outerHeight();
	if (hn!=hp) {
		if (transitionSupport) {
			$("#wrapper #container").css("height",hn);
		} else {
			$("#wrapper #container").stop().animate({height:hn},d);
		}
	}
	hp = hn;
}

// Change the slide of the page to correct slide
function changeSlide() {
	var slidedelay = 300;
	if (transitionSupport) {
		$("#wrapper #container #slider").css("left",-100*curSlide+"%");
		$("#arrow #box").css("left",(100/3)*curSlide+"%");
	} else {
		$("#wrapper #container #slider").animate({left:-100*curSlide+"%"},slidedelay);
		$("#arrow #box").animate({left:(100/3)*curSlide+"%"},slidedelay);
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

fslider = {
	touchSlider: function(frame) {
		fslider.menu = $("#wrapper #arrow #box");
		frame.bind("touchstart",function(e) {
			fslider.startT($(this),e);
			fslider.firstTouch = true;
			fslider.canMove = false;
			return true;
		}).bind("touchmove",function(e) {
			if (fslider.firstTouch && !fslider.canMove) {
				var diffX = Math.abs(e.originalEvent.touches.item(0).clientX - fslider.startX);
				var diffY = Math.abs(e.originalEvent.touches.item(0).clientY - fslider.startY);
				fslider.canMove = diffY < diffX;
				fslider.firstTouch = false;
				return !fslider.canMove;
			} else if (fslider.canMove) {
				fslider.moving = true;
				fslider.moveT($(this),e);
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else return true;
		}).bind("touchend",function(e) {
			if (fslider.moving) {
				fslider.moving = false;
				fslider.endT($(this),e);
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else return true;
		});
	},
	startT: function(item,e) {
		item.add(fslider.menu).addClass("sliding").stop();
		fslider.startX = e.originalEvent.touches.item(0).clientX;
		fslider.startY = e.originalEvent.touches.item(0).clientY;
		fslider.startLeft = parseInt(item.css("left"),10);
	},
	moveT: function(item,e) {
		fslider.movement = e.originalEvent.touches.item(0).clientX - fslider.startX;
		var newLeft = fslider.startLeft + fslider.movement;
		var rightbound = -item.width() * 2/3;
		if (newLeft > 0) newLeft /= 2;
		else if (newLeft < rightbound) newLeft = (newLeft - rightbound)/2 + rightbound;
		var newItemLeft = newLeft / item.parent().width() * 100;
		var newMenuLeft = - newLeft / fslider.menu.parent().width() * (100/3);
		item.css("left",newItemLeft + "%");
		fslider.menu.css("left",newMenuLeft + "%");
	},
	endT: function(item,e) {
		item.add(fslider.menu).removeClass("sliding");
		var goingLeft = (fslider.movement > 0);
		var threshold = 50;
		if (goingLeft && curSlide > 0 && fslider.movement > threshold) curSlide--;
		else if (!goingLeft && curSlide < 2 && fslider.movement < -threshold) curSlide++;
		changeSlide();
	}
};





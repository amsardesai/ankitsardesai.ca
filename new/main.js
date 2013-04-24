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

$.easing.def = "easeOutBounce";
$.easing.easeOutBounce = function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
}

$(document).ready(function() {
	$("#wrapper, #wrapper .body").addClass("initialHide");
	var items = $("#wrapper #header #menuItems li");
	items.addClass("animationReset");
	$("#wrapper").delay(250).fadeIn(250, function() {
	    items.each(function(index) {
			var delay = 150 * index;
			var opacity = 0.7; 
	        $(this).delay(delay).animate({
	            opacity: opacity,
	            top: '0'
	        }, 500, 'linear', function() {
				$(this).addClass("transitioning");
			});
	    });
	});
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

function refreshPages() {
	var hash = window.location.hash;
	if (hash=="#projects") {
		showProjects();		
	} else if (hash=="#contact") {
		showContact();
	} else {
		showAbout();
	}
}

function showAbout() {
	$("#projects").removeClass("shown").addClass("notshown");
	$("#contact").removeClass("shown").addClass("notshown");
	$("#about").removeClass("notshown").addClass("shown");
	doTheSlide();
	document.title = "About - Ankit Sardesai";
}

function showProjects() {
	$("#about").removeClass("shown").addClass("notshown");
	$("#contact").removeClass("shown").addClass("notshown");
	$("#projects").removeClass("notshown").addClass("shown");
	doTheSlide();
	document.title = "Projects - Ankit Sardesai";
}

function showContact() {
	$("#about").removeClass("shown").addClass("notshown");
	$("#projects").removeClass("shown").addClass("notshown");
	$("#contact").removeClass("notshown").addClass("shown");
	doTheSlide();
	document.title = "Contact Me - Ankit Sardesai";
}

function doTheSlide() {
	var slideDelay = 400;
	var timeBetweenUpDown = 100;
	$(".notshown").slideUp(slideDelay).fadeOut(slideDelay);
	$(".shown").delay(slideDelay + timeBetweenUpDown).slideDown(slideDelay).fadeIn(slideDelay);
}
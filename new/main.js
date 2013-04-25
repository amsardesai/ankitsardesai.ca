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

var curSlide;

$(document).ready(function() {
	$("#wrapper").addClass("initialHide");
	$("#arrow").append($("<div>").attr("id","box"));
	var items = $("#wrapper #header #menuItems li");
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
	var totalwidth = $("#wrapper .body").length * $("#wrapper .body").outerWidth();
	var slider = $("<div>").attr("id","slider");
	var w = $("#wrapper .body").outerWidth();
	$("#wrapper #container").wrapInner(slider.css({width:totalwidth}));
	$("#wrapper .body").css({"float":"left"}).attr("id","");
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

function changeSlide() {
	var delay = 250;
	var items = $("#wrapper .body");
	var w = items.outerWidth();
	var h = items.eq(curSlide).outerHeight();

	$("#wrapper #container #slider").animate({"left": -w*curSlide},delay);
	$("#wrapper #container").animate({"height":h},delay);

}

function refreshPages() {
// find proper left value for each
	var hash = window.location.hash;
	if (hash=="#projects") curSlide = 1;
	else if (hash=="#contact") curSlide = 2;
	else curSlide = 0;
	changeSlide();
}











/*
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
*/

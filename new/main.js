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
	var items = $("#wrapper #header #menuItems li").addClass("animationReset");
	var d1 = 300, d2 = 100;
	$("#wrapper").fadeIn(d1, function() {
	    items.each(function(index) {
			var delay = d2 * index;
			var opacity = 0.7; 
	        $(this).delay(delay).animate({
	            opacity: opacity,
	            top: '0'
	        }, d1, 'linear');
	    });
	    $("#arrow #box").delay(items.length*d2).fadeIn(250);
	});
	var slider = $("<div>").attr("id","slider");
	$("#wrapper #container").wrapInner(slider.css({width:3*$("#wrapper .body").outerWidth()}));
	$("#wrapper .body").css({"float":"left"}).attr("id","");
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

function changeSlide() {
	var delay = 250;
	var items = $("#wrapper .body");
	var w = items.outerWidth();
	var h = items.eq(curSlide).outerHeight();
	var m = $("#wrapper #header #menuItems li").outerWidth(true);
	$("#wrapper #container #slider").animate({"left": -w*curSlide},delay);
	$("#wrapper #container").animate({"height":h},delay);
	$("#arrow #box").animate({"left":m*curSlide},delay);
}

function refreshPages() {
	var hash = window.location.hash;
	if (hash=="#projects") {
		curSlide = 1;
		changeSlide();
	} else if (hash=="#contact") {
		curSlide = 2;
		changeSlide();
	} else {
		curSlide = 0;
		changeSlide();
	}
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

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

	$("#wrapper").fadeIn(500, function() {
		var d1 = 300, d2 = 100;
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
	$("#wrapper #container").wrapInner(slider.css({width:"300%"}));
	$("#wrapper .body").css({"float":"left"}).attr("id","");
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

function changeSlide() {
	var delay = 250;
	var items = $("#wrapper .body");
	var w = -100*curSlide + "%";
	var h = items.eq(curSlide).outerHeight();
	var m = (100/3)*curSlide + "%";
	$("#wrapper #container #slider").animate({left:w},delay);
	$("#wrapper #container").animate({height:h},delay);
	$("#arrow #box").animate({left:m},delay);
}

function refreshPages() {
	var hash = window.location.hash;
	if (hash=="#projects") {
		curSlide = 1;
	} else if (hash=="#contact") {
		curSlide = 2;
	} else {
		curSlide = 0;
	}
	changeSlide();
}
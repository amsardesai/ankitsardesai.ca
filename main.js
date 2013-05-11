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

var curSlide, hp=0;

// Startup function
$(document).ready(function() {
	$("#wrapper").addClass("initialHide");
	$("#wrapper #header #menuItems li").addClass("animationReset");
	$("#wrapper #container").wrapInner($("<div>").attr("id","slider"));
	$("#wrapper .body").attr("id","");
	$("#wrapper #arrow").append($("<div>").attr("id","box"));
	$("#wrapper").fadeIn(500, function() {
		$("#wrapper #arrow #box").delay(300).fadeIn(250);
		$("#wrapper #header #menuItems li").each(function(index) {
			var delay = 100 * index;
			var opacity = 0.7;
			$(this).delay(delay).animate({
				opacity: opacity,
				top: '0'
			}, 300, 'linear');
		});
	});

	$(window).on("resize",function(){reHeight(100);});
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

// Animate height of wrapper to correct height
function reHeight(d) {
	var hn = $("#wrapper .body").eq(curSlide).outerHeight();
	if (hn!=hp) $("#wrapper #container").stop().animate({height:hn},d);
	hp = hn;
}

// Change the slide of the page to correct slide
function changeSlide() {
	var slidedelay = 300;
	$("#wrapper #container #slider").animate({left:-100*curSlide+"%"},slidedelay);
	$("#arrow #box").animate({left:(100/3)*curSlide+"%"},slidedelay);
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
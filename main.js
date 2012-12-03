$(document).ready(function() {
	$("#wrapper .body").addClass("initialHide");
	var items = $("#wrapper #header #menuItems li");
    items.addClass("animationReset");

    items.each(function(index) {
		var delay = 150 * index;
		var opacity = 0.7; 
        $(this).delay(delay).animate({
            opacity: opacity,
            top: '0'
            //rotate: angle
        }, 500, 'linear', function() {
			$(this).addClass("transitioning");
		});
    });
	
	$(window).hashchange(refreshPages);
	$(window).hashchange();
});

function refreshPages() {
	var hash = window.location.hash;
	if (hash=="#projects")
		showProjects();
	else if (hash=="#contact")
		showContact();
	else
		showAbout();
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
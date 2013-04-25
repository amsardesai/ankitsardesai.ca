<!DOCTYPE html>
<!-- Written by Ankit Sardesai -->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
	<title>Ankit Sardesai</title>
	<link rel="stylesheet" href="base.css" type="text/css" />
	<!--[if lte IE 8]><link rel="stylesheet" href="iestyles.css" type="text/css" /><![endif]-->
	<script src="jquery.js" type="text/javascript"></script>
	<script src="main.js" type="text/javascript"></script>
</head>

<body>
	
<div id="wrapper">
	
	<!-- HEADER -->
	
	<div id="header">
		<div id="mainLogo"></div>
		<div id="arrow"></div>
		<ul id="menuItems">
			<li>
				<a href="#about">
					<span class="icon" id="imgAbout"></span>
					<span class="label">About</span>
				</a>
			</li>
			<li>
				<a href="#projects">
					<span class="icon" id="imgProjects"></span>
					<span class="label">Projects</span>
				</a>
			</li>
			<li>
				<a href="#contact">
					<span class="icon" id="imgContact"></span>
					<span class="label">Contact</span>
				</a>
			</li>
		</ul>
	</div>
	
	<div id="container">
	
	<!-- BODY: About -->
	
	<div id="about" class="body">
		<h3>About Me</h3>
		
		<p>
			Welcome to my website! 
		</p>
		<p>
			My name is <strong>Ankit Sardesai</strong>, and I am a student at the University of Waterloo studying <strong>Software Engineering</strong>.
		</p>

		<p>
			Click on the links above to view my resume and side projects, and find ways to get in touch with me.
		</p>

	</div>
	
	<!-- BODY: Projects -->
	
	<div id="projects" class="body">
		<h3>My Projects</h3>
		<p>Some cool projects I have worked on in my spare time:</p>
		<ul>
			<li><a href="/css3transform">CSS3 Transformations</a> - Visual tool demonstrating how the CSS3 transform function and transformation matrices work.</li>
			<li><a href="/uw-roomschedule">UW RoomSchedule</a> - Retrieves the class/tutorial schedule for individual rooms throughout the University of Waterloo campus.</li>
		</ul>
		<p>The source code for these projects are available on <a href="https://www.github.com/amsardesai/">Github</a>.</p>
		<p>If you would like to work with me on a project, click <a href="#contact">here</a> to go to my contact information.</p>
	</div>
	
	<!-- BODY: Contact -->
	
	<div id="contact" class="body">
		<h3>Get in Touch!</h3>

		<p>Here are some ways to get in touch with me: </p>
		<div id="contactimages">
			<a href="mailto:me@ankitsardesai.ca" title="Email" class="imgref">
				<img src="iconEmail.svg" alt="Email" />
			</a>
			<!--<a href="https://www.facebook.com/amsardesai" alt="Facebook" title="Facebook">
				<img src="iconFacebook.svg" />
			</a>-->
			<a href="https://www.github.com/amsardesai" title="Github" class="imgref">
				<img src="iconGithub.svg" alt="Github" />
			</a>
			<a href="https://www.linkedin.com/in/amsardesai" title="LinkedIn" class="imgref">
				<img src="iconLinkedin.svg" alt="LinkedIn" />
			</a>
		</div>
		<div id="bottomlabel">Icons are from <a href="http://fairheadcreative.com/">fairheadcreative.com</a></div>
	</div>
	
	</div>

	<!-- FOOTER -->
	
	<div id="footer">
		&copy; Ankit Sardesai 2013
	</div>
	
</div>
	
</body>

</html>
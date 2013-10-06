# ankitsardesai.ca

Source code for [my website](http://ankitsardesai.ca).

Built using:
-    NodeJS
-	ExpressJS (and Jade)
-	LESS
-	CoffeeScript
-	Bootstrap
-	FontAwesome

The website is deployed on the Heroku platform.

### Installing

To create an instance of ankitsardesai.ca on your computer, clone this repository and install all dependencies. Ensure [NodeJS and NPM](http://nodejs.org) are installed on your computer.

	git clone https://github.com/amsardesai/ankitsardesai.ca.git
	cd ankitsardesai.ca/
	make

### Running

To run an instance of ankitsardesai.ca on your computer, make sure CoffeeScript is installed on your computer.

	sudo npm install -g coffee-script

Then, run the application.

	coffee app.coffee

### Uninstalling modules

To remove all NPM modules in this package, perform the following command.

	make clean

&copy; Ankit Sardesai 2013
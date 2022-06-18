# ankitsardesai.ca

Source code for [my website](https://ankitsardesai.ca).

* Front-end built using [**React**](https://github.com/facebook/react) and
  [**Redux**](https://github.com/rackt/redux) with universal rendering.
* Photo data stored in a **sqlite** database and photos are stored on **Amazon S3**.
* Using **Docker** to build and deploy on **Amazon EC2 Container Service**.
* Content delivery and DDOS protection using **CloudFlare**.

## Installing

### Using Docker

To run the production version of this site with docker, clone and run the following:

    docker build -t ankitsardesai . # This will take a long time
    docker run -d --name instance.ankitsardesai -p 443:443 ankitsardesai

Then go to `https://<your docker IP>/`.

### Manually

To run the development version of this site, install `sqlite3` and `node`, then clone and
run the following:

    sqlite3 -init database.sql ankit.db ""
    export DB_URL="$(pwd -P)/ankit.db"
    npm install
    npm run watch

Then go to `http://localhost:3000/`

## Copyright

&copy; Ankit Sardesai 2016

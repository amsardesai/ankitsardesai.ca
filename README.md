# ankitsardesai.ca

Source code for [my website](https://ankitsardesai.ca).

- Front-end built using [**React**](https://reactjs.org/) and
  [**Redux**](https://redux.js.org/).
- Photo data stored in a **sqlite** database and photos are stored on **Amazon S3**.
- Using **Docker** to build and deploy on **Amazon EC2**.
- Content delivery and DDOS protection using **CloudFlare**.

## Installing

### Using Docker

To run the production version of this site with docker, clone and run the following:

    docker-compose build
    docker-compose up

Then go to `https://<your docker IP>/`.

### Manually

To run the development version of this site, install `sqlite3` and `node` globally,
then clone and run the following:

    npm install
    npm run setup-db
    npm run watch

Then go to `http://localhost:5092/`

## Copyright

&copy; Ankit Sardesai 2022

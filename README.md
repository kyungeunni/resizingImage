I used Docker to run Mongodb for my webserver.
Before you run the app, please run docker image like below.

$ sudo docker run -d -p 17017:27017 --name resize-mongo mongo 


and before run the web server, please :
1. install npm modules
$ npm install

2. run the app
$ node app.js
or
$ npm start


Thanks.

Kyungeun Kim


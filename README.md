#Giphy-Node-Stuff
===========================
##What is it?
===========================
Register, login, and query the [Giphy](http://giphy.com/) API using Node.js and some MongoDB magic.

*UNDER HEAVY CONSTRUCTION*


===========================
##Instructions
===========================
1.	Installation
  1.	Node.js
    1.	Download and Install Node.js.
Link: http://nodejs.org/download/
  2.	mongoDB
    1.	Download and Install mongoDB.
Link: https://www.mongodb.org/downloads
  3.	Giphy Node Stuff
    1.	Download project files for Giphy Node Stuff (whatever branch).
    2.	Extract Giphy Node Stuff to your local machine.	
    3.	File directory setup
      1.	After extracting, your file director should be as displayed as below:
<pre><code>
+-lib
|	+--crud.js
|	+--routes.js
|	`--user.js
+--server.js
`--package.json
+--public
|	`--index.html
	+--lib
	|	+--skeleton
	|		+--normalize.css
	|		`--skeleton.css
	|	+--backbone.js
	|	+--jquery.js
	|	`--underscore.js
</code></pre>
2.	npm package install
  1.	Open Command Prompt.
  2.	Navigate to Giphy Node Stuff top level directory.
  3.	Type npm install and press Enter.
    1.	This will install all of the server dependencies listed in the package.json file which resides in the top level directory listed in Table 1 above.
3.	mongoDB Database Setup
  1.	Create a directory on the server or local machine to store the database files for the users and graphs.
  2.	Open Command Prompt.
    1.	Type mongod --dbpath <directory created in previous step> and press Enter.
    2.	You may now close the Command Prompt for mongod
  3.	Open another Command Prompt.
    1.	Type mongo and press Enter.
    2.	Type use gns and press Enter.
    3.	Type db.user.insert({“username”:”<some name>”, “password”:”<some password>”}); and press Enter.
      1.	Repeat this step for all of the various users you wish to have access to the system when using the Giphy Node Stuff application.  
  4.	You may now close the Command Prompt for mongo.
4.	Application Setup
  1.	Database
    1.	Open Command Prompt (on Server).
    2.	Type mongod --dbpath <directory created in previous step> and press Enter.
  2.	Server
    1.	Open Another Command Prompt (on Server).
    2.	Navigate to Giphy Node Stuff top level directory.
    3.	Type node app.js and press Enter.
  3.	Web Application
    1.	Open a web browser.
    2.	If web browser opened on same machine as server:
      1.	Type http://localhost:3000 and press Enter.


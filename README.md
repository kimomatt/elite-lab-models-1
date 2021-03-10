# Elite Lab 6: Sessions

## Intro
In this lab, we will be improving our chatrooms by creating persistent sessions. This concept is what drives a lot of our online interaction. Any time you log in, you are creating a session. This is what allows you to log in to reddit/facebook/gmail, and stay logged in (even if you close your browser).

We will be exploring how the server Python code and client Javascript code interact. You will be editing parts of both.

This will also be your first time working with Javascript in this course. I've added a lot
more print statements this time, and a whole lot more comments. Be sure to look closely
at `session.js` as it'll be a good starter on how to write javascript code.

I've prepped some quick reference links down below to help you out:

* https://flask.palletsprojects.com/en/1.1.x/quickstart/#routing

* https://api.jquery.com/jquery.ajax/

* https://www.w3schools.com/js/js_variables.asp

* https://www.w3schools.com/js/js_objects.asp


Remember to always use Google and StackOverflow as a resource if you are not sure how to implement something. Feel free to reach out to me as well.


## Objective
### Task
Your task is to create the APIs that the web page can use to create session tokens and retrieve them. You will also be editing your webpage's javascript code to add the correct URLs.

Lab is complete when you are able to succesfully:
* Enter a chatroom with a username
* Open up the chatroom in a separate browser and still be logged in as the same user

You will be editing these files:
* `app/static/js/session.js`
* `app/controllers.py`

You don't need to modify anything else.

If you look closely into the `session.js` file, it will make a single Ajax request to create a session. You will need to fill out:
* Where to send this request (the url)
* What to put into the request (the body)

If you look into `controllers.py`, you will need to implement the API to create a session. You will need to create a single API endpoint that will handle creating sessions. It will consist of:
* The URL name (and supported request type)
* Flask function that will handle
  * How to get the username from the request body
  * How to create the session
  * How to return the token in the response


### Context
We have provided you with starter and demo code. 

We have also provided `scripts/util.py` that you can run in the command line. This script can help insert test messages into your database and also delete all messages (so you can start fresh if need be). This is to help you out, but not needed for completion.


## Set Up
* Fork and clone the repository to your local dev environment

* Activate your virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

* Install the dependencies to your virtual environment
```
pip3 install -r requirements.txt
```

* Start up your SQLite database with:
```
python3 -m flask db init
python3 -m flask db migrate -m "my first migration"
python3 -m flask db upgrade
```

* Spin up the local web server with:
```
python3 -m flask run
```


## Lab Steps
* Look through the `app/static/js/session.js` file and read the comments to learn about what it does.

* Look at the Ajax request in this file and notice what it expects in the response.

* Look through `app/models.py` file and notice the manager function `SessionManager.create_session`. Notice what it takes in as an argument and what it returns.

* (Optional) Run the `scripts/util.py` script to seed your database with test messages

* Name your API and implement its handler function

* Complete the javascript code to call that API correctly

* Enter the chatroom and validate that you can start a session

* Send some messages as yourself in this session

* Open the same webpage in a different browser window (or tab) and check if you are still logged in as the same person. Also, try opening an incognito browser and see whether or not you're still logged in!

* You're done!


## Lab Advice
* Read the comments in `app/static/js/session.js`. We go in-depth on what the javascript code is doing. Feel free to ask me further questions about callbacks.

* Look at the `app/models.py` specifically the `SessionManager.create_session` function. Notice what kind of argument it takes in. Notice what it returns. This will determine what you need to do with the request and response in `app/controllers.py`

* Open the webpage console (right click on the webpage and click inspect) to see the Javascript print statements. It will be very useful for debugging.

* You should not need to modify the schema, but if your database goes out of sync with your schema, you can run these commands:
```
python3 -m flask db stamp head
python3 -m flask db migrate
python3 -m flask db upgrade
```

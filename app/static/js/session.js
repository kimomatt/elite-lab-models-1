$(function () {
  // Backend API URLs
  var baseUrl = 'http://127.0.0.1:5000/';
  var createSessionUrl = ''; // DEFINE HERE

  // jQuery Variables
  var $messages, $messageInput;
  $messages = $('#message-list');
  $usernameInput = $('#username-input');

  // This is a jQuery function that runs when the html element that usernameInput refers to
  // receives the "submit" action (this means the button was clicked or the enter key was pressed)
  $usernameInput.on('submit', function (e) {
    e.preventDefault();
    var text = $('input:text').val();
    createSession(text);
  });

  // We use the Cookies library to set the provided token as a cookie
  function setCookie(token) {
    console.log("Setting token to cookies: " + token);
    Cookies.set('elite-channel-token', token);
  }

  // Here I'll explain everything going on in this AJAX request
  function createSession(username) {
    // Create new message in this channel in backend
    console.log("Creating token for: " + username);

    // Create a Javascript object to use as the request body (similar to python dict)
    requestBody = {}; // DEFINE HERE

    // $ stands for jquery. It is shorthand for calling the library
    // The function we are calling is "ajax". It allows us to make ajax requests,
    // we just need to give it some parameters
    $.ajax({
      type: "POST", // This is the request type. Remember, we usually use GET, POST, PUT, DELETE
      url: createSessionUrl, // The url we want to send the request to
      data: JSON.stringify(requestBody), // The request body (json data to send to the server)
      dataType: 'json', // We need to indicate that we are sending json data with this request
      contentType: "application/json", // Same deal as the line above

      // This is very important. This is called a callback function. 
      // Callback functions are run after the Ajax request has received a response
      // Usually it will contain data that you can use to decide what to do next
      // IMPORTANT: These functions do not run immediately after you call it. Instead they
      //     run after a successful response is received. That means that the request needs to be
      //     sent to the server and the server needs to respond, before you get your result.
      //     This is called asynchronous. You can not use the results immediately, you have to wait
      //     until after the response is sent back. Please talk to me if this is still fuzzy.
      success: function (data) {
        console.log("Got token: " + data.token);
        // Set a cookie with response data from the request
        setCookie(data.token);
        // Redirect us to the chatroom page, now that we have the session token set
        window.location.replace(baseUrl);
      },

      // Also a callback function, but for if the server responds with an error
      error: function () {
        alert("Something went wrong");
      }
    });
  }

});
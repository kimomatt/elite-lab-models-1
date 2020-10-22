$(function () {
  var INTERVAL = 5000;

  // Object Urls
  var userSelf = '';
  var chatroomID = 'mainchat';
  var lastMessageID = '';
  var updateLock = false;

  // Backend API URLs
  var baseUrl = 'http://127.0.0.1:5000/';
  var createMessageUrl = `${baseUrl}messages/`;
  var refreshMessagesUrl = `${baseUrl}chat/${chatroomID}/updates`;
  var initMessagesUrl = `${baseUrl}chat/${chatroomID}/last`;
  var sessionTokenUrl = `${baseUrl}session/`;

  // jQuery Variables
  var $messages, $messageInput, $logoutButton;
  $messages = $('#message-list');
  $messageInput = $('#message-input');
  $logoutButton = $('#logout-button');

  $messageInput.on('submit', function (e) {
    e.preventDefault();
    var text = $('input:text').val();
    console.log(text);
    postMessage(text);
    $('input:text').val('');
    scrollChatToBottom();
  });

  $logoutButton.on('click', function () {
    clearCookie();
    // Redirect back to session create
    window.location.replace(baseUrl + 'session-page/');
  });

  function scrollChatToBottom() {
    $("#chat-window").animate({
      scrollTop: $('#chat-window').prop("scrollHeight")
    }, 1000);
  }

  // Create new message in this channel in backend
  function postMessage(text) {
    requestBody = {
      username: userSelf,
      chat_id: chatroomID,
      content: text
    }
    $.ajax({
      type: "POST",
      url: createMessageUrl,
      data: JSON.stringify(requestBody),
      dataType: 'json',
      contentType: "application/json",
      success: function (data) {
        refreshMessages();
      }
    });
  }

  // Poll for new messages
  function refreshMessages() {
    if (updateLock) {
      return
    } else {
      updateLock = true;
      refreshUrl = refreshMessagesUrl + '?ref_id=' + lastMessageID.toString();
      $.ajax({
        type: "GET",
        url: refreshUrl,
        success: function (data) {
          renderMessages(data['messages']);
          updateLock = false;
        },
        error: function () {
          updateLock = false;
        }
      });
    }
  }

  // Check for token in cookies
  function getCookie() {
    var token = Cookies.get('elite-channel-token')
    // Make sure we standardize null response
    if (!token) {
      return null;
    }
    return token;
  }

  // Clear token from cookies
  function clearCookie() {
    Cookies.remove('elite-channel-token');
  }

  // Logic needed to load page and initial messages
  function initPage() {
    var token = getCookie();
    if (!token) {
      console.log("No token found: Redirecting back to session create");
      // If no token, then redirect to create session
      window.location.replace(baseUrl + 'session-page/');
    }
    console.log("Here's the token: " + token);
    var urlWithToken = sessionTokenUrl + token + '/username/'
    $.ajax({
      type: "GET",
      url: urlWithToken,
      success: function (data) {
        username = data['username'];
        userSelf = username;
        initMessages();
      },
      error: function () {
        $('#content').replaceWith("<h1>Something Went Wrong</h1>");
      }
    })
  }

  // Load initial messages
  function initMessages() {
    $.ajax({
      type: "GET",
      url: initMessagesUrl,
      success: function (data) {
        if (data['messages'].length == 0) {
          lastMessageID = 0;
        }
        renderMessages(data['messages']);
        scrollChatToBottom();
      }
    });
  }

  // Add HTML to display new messages
  function renderMessages(messages) {
    messages.forEach(function (message) {
      if (message['username'] === userSelf) {
        $messages.append(`<li class="own-message"><div class="message-box">${message['content']}</div></li>`);
      } else {
        $messages.append(`<div>${message['username']}</div><li class="participant-message"><div class="message-box">${message['content']}</div></li>`);
      }
      lastMessageID = message['id'];
    });
    // scroll to bottom if there were new messages
    if (messages.length > 0) {
      scrollChatToBottom();
    }
  }

  initPage();

  // Continuously run refreshMessages at a certain interval
  setInterval(refreshMessages, INTERVAL);
});
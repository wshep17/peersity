//variable created that mirrors connection made in the backend

//matches the connection made in the server side
//Query dom
var message = document.getElementById('message')
var handle = document.getElementById('handle')
var btn = document.getElementById('send')
var output = document.getElementById('output')
var leavebtn = document.getElementById('leave')

var buttonjoin = document.getElementById('button-join')
var buttonleave = document.getElementById('button-leave')
var ul = document.getElementById('ulId')
var minutes = 3 //give the ajax request some time to set minutes
var minRemove = 0 //minutes we will pass to remove from the user
var tutoring = false //use the user's isTutor and tutorInUserState field to determine
var showOnce = 0 //set for only showing notification once
window.addEventListener('load', function() {
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
  $.ajax({
    url:'http://localhost:6969/chat/getUserInfo',
    method: 'GET',
    contentType: 'application/json',
    success: function(data) {
      // console.log('get request was successful')
      // console.log(data)
      // console.log(data.userInfo.minutes)
      minutes = data.userInfo.minutes
      tutoring = data.userInfo.isTutor && !data.userInfo.tutorInUserState
      console.log('tutoring is ' + tutoring)
    }
  })
})

if(minutes <= 0 && !tutoring) {
  if (window.Notification && Notification.permission === "granted" && showOnce == 0) {
    showOnce++
    var notification = new Notification("Minutes are up!", {body: "Your minutes have expired. You will be redirected to the home page momentarily"});
    setTimeout(function() {notification.close()}, 5000);
  } else if(showOnce == 0) {
    showOnce++
    alert("Your minutes have expired. You will be redirected to the home page momentarily.")
  }
  //using leave btn functionality
  //
  var obj = {
      minutes: minRemove
  };
  var URL = 'http://localhost:6969/chat'
  var destination = 'http://localhost:6969/home'

      $.ajax({
          url: URL,
          type: "POST",
          data: JSON.stringify(obj),
          contentType: "application/json",
          success: function() {
            console.log("Successful")

          },
          error: function() {
              console.log("CMON! nabbit, ya gotta issue with ur ajax request")
          }
      });
      /*using setTimeout keeps the socket from executing immediately after the condition is true, because when it executes immediately
      it messes with the ajax request */
      setTimeout(function() {socket.emit('leave', {handle: handle.value, destination: destination})}, 5000);//
//
}

setInterval(function() {
  minutes--;
  minRemove++;
  console.log(minutes + ' left')
  console.log(minRemove + ' to remove')
  if(minutes <= 0 && !tutoring) {
    if (window.Notification && Notification.permission === "granted" && showOnce == 0) {
      showOnce++
      var notification = new Notification("Minutes are up!", {body: "Your minutes have expired. You will be redirected to the home page momentarily."});
      setTimeout(function() {notification.close()}, 5000);
    } else if(showOnce == 0){
      showOnce++
      alert("Your minutes have expired. You will be redirected to the home page momentarily.")
    }
    //using leave btn functionality
    //
    var obj = {
        minutes: minRemove
    };
    var URL = 'http://localhost:6969/chat'
    var destination = 'http://localhost:6969/home'

        $.ajax({
            url: URL,
            type: "POST",
            data: JSON.stringify(obj),
            contentType: "application/json",
            success: function() {
              console.log("Successful")
              socket.emit('leave', {handle: handle.value, destination: destination})
            },
            error: function() {
                console.log("CMON! nabbit, ya gotta issue with ur ajax request")
            }
        });
        /*using setTimeout keeps the socket from executing immediately after the condition is true, because when it executes immediately
        it messes with the ajax request */
        setTimeout(function() {socket.emit('leave', {handle: handle.value, destination: destination})}, 5000);
  //
  }
}, 60000)

//emit events

window.addEventListener('load', function() {


    socket.emit('load', {
      handle: handle.value
    })


buttonjoin.addEventListener('click', function() {
  socket.emit('joinedCall', {
    handle: handle.value
  })
})

buttonleave.addEventListener('click', function() {

  socket.emit('leftCall', {
    handle: handle.value
  })
})

})
btn.addEventListener('click', function() {
socket.emit('chat', {
message: message.value,
handle: handle.value
})
})



leavebtn.addEventListener('click', function() {
  var obj = {
      minutes: minRemove
  };
  var URL = 'http://localhost:6969/chat'
  var destination = 'http://localhost:6969/home'
  event.preventDefault();
      $.ajax({
          url: URL,
          type: "POST",
          data: JSON.stringify(obj),
          contentType: "application/json",
          success: function() {
            console.log("Successful")

          },
          error: function() {
              console.log("CMON! nabbit, ya gotta issue with ur ajax request")
          }
      });
      /*using setTimeout keeps the socket from executing immediately after the condition is true, because when it executes immediately
      it messes with the ajax request */
      setTimeout(function() {socket.emit('leave', {handle: handle.value, destination: destination})}, 2000);
})



//listen for events
//listens for 'chat' traffic on the opened port on the client side
socket.on('chat', function(data) {
  if (data.message =="" && data.handle == handle.value) {
    alert("Please do not spam or leave the message field empty.")
  } else if (data.message != "") {
    ul.innerHTML += '<li class=\"chats\">'+ data.handle +'<p>' + data.message + '</p>' +'</li>';
    document.getElementById('message').value = "";
  }
  $("#bottom-div").animate({ scrollTop: $('#bottom-div').prop("scrollHeight")}, 500);
})
socket.on('load', function(data) {
  ul.innerHTML += '<li class=\"chats\"><p>' + data.handle + ' has just joined the room! </p>' +'</li>';
  $("#bottom-div").animate({ scrollTop: $('#bottom-div').prop("scrollHeight")}, 500);
})
socket.on('leave', function(data){
  ul.innerHTML += '<p>' + data.handle + ' has left the room. </p>';
  //route to home from here
  window.location.href = data.destination;
})
socket.on('joinedCall', function(data) {
  ul.innerHTML += '<li class=\"chats\"><p>' + data.handle + ' has joined the call! </p>' +'</li>';
  $("#bottom-div").animate({ scrollTop: $('#bottom-div').prop("scrollHeight")}, 500);
})
socket.on('leftCall', function(data) {
  ul.innerHTML += '<li class=\"chats\"><p>' + data.handle + ' has left the call. </p>' +'</li>';
  $("#bottom-div").animate({ scrollTop: $('#bottom-div').prop("scrollHeight")}, 500);
})


message.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   btn.click();
  }
});

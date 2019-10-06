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
var seconds = 0;


//emit events
var count = 0;
window.addEventListener('load', function() {

if(count == 0) {
count++;
socket.emit('load', {
handle: handle.value
})
}

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

window.onload = function time() { //replace window.onload with the confirmation button onclick event
                 //so use <confirmationbutton>.onclick to replace window.onload
  setInterval(function() {
    seconds++;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var displaySeconds = ((seconds % 60) < 10) ? ("0" + Math.trunc(seconds % 60)) : Math.trunc(seconds %  60);
    var displayMinutes =((minutes % 60) < 10) ? ("0" +  Math.trunc(minutes % 60)) : Math.trunc(minutes %  60);
    var displayHours = Math.trunc(hours);
    document.getElementById('timer').innerHTML = '<p>' + displayHours + ':' + displayMinutes + ':' + displaySeconds + '</p>';
  }, 1000);
}

leavebtn.addEventListener('click', function() {
  var obj = {
      seconds: seconds
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
socket.emit('leave', {
handle: handle.value,
destination: destination
}  )
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

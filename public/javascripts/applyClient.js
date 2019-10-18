$(document).ready(async function() {
  $.ajax({
    url:'http://localhost:6969/chat/getUserInfo',
    method: 'GET',
    contentType: 'application/json',
    success: function(data) {
      // console.log('get request was successful')
      // console.log(data)
      // console.log(data.userInfo.minutes)
      if(data.userInfo.hasApplied == true){
        window.location.href = 'http://localhost:6969/home'
      }
    }
  })
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
})

/* You can use a url that is not in the route of the current page url (the url value in the ajax has no relationship with the apply.js url),
 because all the url is a resource that you can go to and do something with based on the request */

//var socket = io.connect('http://localhost:3000');
var requestBtn = document.getElementById('sendRequest');



/*requestBtn.addEventListener('click', function() {
	socket.emit('notify', {
		message: requestBtn.value
	})
})*/


/*$(document).ready(function() {
	$(".sendRequest").click(function(e) {
		var clickedCell = $(e.target).closest("td");
		socket.emit('notify', {
			message: clickedCell.attr('value');
		})
 });
});*/


var socket = io.connect('http://localhost:6969');
$(document).ready(function() {
   $('.sendRequest').each(function() {
      $(this).click(function() {
      	var id = $(this).attr('value');
		socket.emit('notify', {
			room: id,
			message: 'You have been requested',
		})
		socket.emit('subscribe', {
			room: id
		})
      });
   });
});
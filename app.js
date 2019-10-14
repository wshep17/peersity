var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var mongoUtil = require('./mongoUtil');
var cors = require('cors');
var braintree = require('braintree');


//MongoDB session store
var app = express();

var store = new MongoDBStore ({
  uri: 'mongodb://localhost/NoteLink',
  collection: 'session'
});


var nodemailer = require('nodemailer');

//SocketIO import & Setup
var socket_io = require('socket.io');
var io = socket_io(); //instance of socket.io
app.io = io; //Ask Andre what this assignment means?

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle Sessions
app.use(session({
  secret:'sas63aeiwe8o-3$%^@()$_+@$0',
  cookie: {
  	maxAge: 180 * 60 * 1000
  },
  store: store,
  resave: true,
  saveUnitialized: true
}));

app.use(cors());
//MongoDB connection when server is online
mongoUtil
	.connectToServer(function(err) {
		var landingpage = require('./routes/landingpage');
		var users = require('./routes/users');
		var home = require('./routes/home');
		var findatutor = require('./routes/findatutor');
		var results = require('./routes/results');
		var apply = require('./routes/apply');
		var admin = require('./routes/admin');
		var chat = require('./routes/chat');
		var requests = require('./routes/requests');
    var checkout = require('./routes/checkout');
    var client_token = require('./routes/client_token');
    var overview = require('./routes/overview');
    var payment = require('./routes/payment');
		app.use('/', landingpage);
    app.use('/overview', overview);
		app.use('/users', users);
		app.use('/home', home);
		app.use('/findatutor', findatutor);
		app.use('/results', results);
		app.use('/apply', apply);
		app.use('/admin', admin);
		app.use('/chat', chat);
		app.use('/requests', requests);
    app.use('/checkout', checkout);
    app.use('/client_token', client_token);
    app.use('/payment', payment);

		//app.use('/search', search);
		//Claim: All Connection information is established in www. No need to listen again here...
/*		app.listen(3000, function() {
			console.log('app working on 3000')
		})*/
		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
		  var err = new Error('Not Found');
		  err.status = 404;
		  next(err);
		});
		//error handler
		app.use(function(err, req, res, next) {
		  res.status(err.status || 500);
		  res.render('error', {
		    message: err.message,
		    error: {}
		  });
		});
	})

/*MongoClient
	.connect('mongodb://localhost:27017/NoteLink', {useNewUrlParser: true, poolSize: 10 })
	.then(client => {
		var db = client.db('NoteLink');
		var collection = db.collection('DefaultUser');
		//console.log(collection);
		app.locals.collection = collection; //locals allows us to share data between routes
		app.listen(3000, () => {
  		console.log('app working on 3000')
  	});
	})
	.catch(error => console.log(error));*/

// Passport
app.use(passport.initialize());
app.use(passport.session());


// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

  //Socket.io implementation
  io.on('connection', function(socket) {
    var room;
    var name;

    console.log("a user has connected");
    //io.removeAllListeners('connection');

    socket.on('subscribe', function(data) {
      room = data.room;
      name = data.name;
      socket.join(room)
      console.log("User " + name)
      console.log("Joining room", room)
    })

    socket.on('chat', function(data) {
      console.log('The target room isss ' + room)
      io.sockets.in(room).emit('chat', data);
    })

    socket.on('notify', function (data) {
      io.sockets.in(data.room).emit('notify', {
        notification: data.message
      })
    })
    socket.on('enterChat', function(data) {
      console.log("We are inside the enterChat using room " + room)
      io.sockets.in(room).emit('enterChat', {
        room: room
      })
    })
    socket.on('load', function(data) {
      io.sockets.in(room).emit('load', data);
    })
    socket.on('leave', function(data) {
      io.sockets.in(room).emit('leave', data);
    })
    socket.on('joinedCall', function(data) {
      io.sockets.in(room).emit('joinedCall', data);
    })
    socket.on('leftCall', function(data) {
      io.sockets.in(room).emit('leftCall', data);
    })
    socket.on('disconnect', function() {
      socket.removeAllListeners('chat')
      console.log(name + " has disconnected")
    })
    socket.on('dequeue', function(data) {
      socket.broadcast.emit('dequeue', {
        id: data.id
      })
      console.log("the id is" + data.id)
    })
 });



function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}


module.exports = app;

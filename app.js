var express = require('express');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var http = require('http');
var cors = require('cors');
var OneSignal = require('onesignal-node');
const app = express()
var server = http.Server(app);
const User = require('./models/users');

var myClient = new OneSignal.Client({      
   userAuthKey: 'MGUyMzJlY2QtNGI0YS00ODBjLTk1MzctYjUxNWE0YjRmNmY3',      
   // note that "app" must have "appAuthKey" and "appId" keys      
   app: { appAuthKey: 'M2E0N2YzMWItMWE3OS00ZDZjLWIzYmYtMzczY2M3ZDQwYjA0', 
   appId: '8e764183-7e1b-4609-8f31-b066eecc3750' }      
});  

var websocket = socketio(server);
websocket.origins('*:*');
app.use(cors())
app.use(express.static("public"))

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.post('/saveUUID' , (req, res)=>{
   console.log(req.body);
   User.findOne({userID: req.body.userID}, (err, user)=>{
      if(user){
         user.UUID = req.body.UUID;
         user.save( ()=>{
            res.json(true);
         })
      }else{
         const u = new User({
            UUID: req.body.UUID,
            userID: req.body.userID
         });
         u.save( ()=>{
            res.json(true);
         })
      }
   })
});

app.post('/socket' , (req, res)=>{
   console.log('socket ===>');
   User.findOne({userID: req.body.user_id} , (err, user)=>{
   if(user){
   var firstNotification = new OneSignal.Notification({      
    contents: {      
        en: req.body.message
    },    
    include_player_ids: [user.UUID]
});
  myClient.sendNotification(firstNotification, function (err, httpResponse,data) {      
   if (err) {      
       console.log('Something went wrong...');      
   } else {      
       console.log('sent notif');
        websocket.emit( req.body.user_id , req.body);
   websocket.emit( req.body.sender_id+'!!' , req.body);
   res.json(true);
       //console.log(data);      
   }      
});   
   }else{
       websocket.emit( req.body.user_id , req.body);
   websocket.emit( req.body.sender_id+'!!' , req.body);
   res.json(true);
   }
   });
})

server.listen(8080, () => console.log('listening on *:8080'));

//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = `mongodb://<db_name>:<>db_password@ds111993.mlab.com:11993/qade`
mongoose.connect(mongoDB , { useNewUrlParser: true });


// The event will be called when a client is connected.
websocket.on('connection', (socket) => {
   console.log('connected to server');
   //websocket.emit( 52 ,  {message:'hey guys'} );
});
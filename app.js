var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Sequelize = require('sequelize')
var bodyParser = require('body-parser');
var sequelize = new Sequelize('postgres://jettang:rty618816@localhost:5432/suzao_im_test');

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const User = sequelize.define('user', {
  name: {
   type: Sequelize.STRING(16),
    allowNull:false
  },
  cipher: {
    type: Sequelize.STRING(16),
    allowNull:false
  },
  state: {
    type: Sequelize.INTEGER(1),
    allowNull:false,
    defaultValue:0
  }
});

const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING(16),
    allowNull:false
  },
  number: {
    type: Sequelize.INTEGER(8),
    allowNull:false
  },
  user: {
    type: Sequelize.INTEGER,
    references: {
       model: User,
       key: 'id'
    }
  }
})

const Message = sequelize.define('message', {
   content: {
     type: Sequelize.TEXT,
     allowNull:false
   },
   type: {
     type: Sequelize.INTEGER(1),
     allowNull:false
   },
   receiver:{
     type: Sequelize.INTEGER,
     references: {
        model: User,
        key: 'id'
     }
   },
   sender: {
     type: Sequelize.INTEGER,
     references: {
        model: User,
        key: 'id'
     }
   }
})

//User.sync({force:true})
//Group.sync({force:true})
//Message.sync({force:true})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var success = {code:10000}
var fail = {code:10001}

app.post('/user',function(req,res){
    console.log(req.body)
    User.findAll({where:req.body}).then((user)=>{
        if(!user){
            req.body['gender'] = 0
            req.body['state'] = 0
            User.create(req.body).then(()=>{
                 res.json(success)
            })
        }else{
            res.json(user)
        }
    })
})

app.post('/message',function(req,res){
    Message.create(req.body).then(()=>{
        res.json(success)
    })
})

app.get('/message/:id',function(req,res){
})

app.post('/group',function(req,res){
   console.log(req.body)
    res.json(req.body)
})

app.get('/group/:id',function(req,res){
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
	io.emit('chat message', msg);
	console.log("msg:"+msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

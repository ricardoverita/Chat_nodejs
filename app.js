var express = require('express'),http = require('http');
var app = express();
var server = http.createServer(app);
app.set('views',__dirname + '/views');
app.configure(function(){
	app.use(express.static(__dirname));
});
app.get('/',function(req,res){
	res.render('index.jade',{layout:false});
});
server.listen(8080);

//websockets

var io = require('socket.io').listen(server);
var usuariosConectados = {};
io.sockets.on('connection',function(socket){
	socket.on('enviarNombre',function(dato){
		if(usuariosConectados[dato])
			socket.emit('errorName')
		else
		{
			socket.nickname = dato;
			usuariosConectados[dato] = socket.nickname;
		}
		data = [dato,usuariosConectados];
		io.sockets.emit('mensaje',data);
	});
	socket.on('enviarMensaje',function(mensaje){
		var data = [socket.nickname, mensaje];
		io.sockets.emit('newMessage',data);
	});
	socket.on('disconnect',function(){
		delete usuariosConectados[socket.nickname];
		data = [usuariosConectados,socket.nickname];
		io.sockets.emit('usuarioDesconectado',data);
	});
	
});
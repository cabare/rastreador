var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

// enviando o mapa com  com a localização para quem acessar esssa rota
app.get('/mapa', function(req, res){
    res.sendfile(__dirname + '/view/mapa.html');
});

// enviando o HTML de registro e envio de localização
app.get('/cliente', function(req, res){
    res.sendfile(__dirname + '/view/cliente.html');
});

io.sockets.on('connection', function(socket){
    socket.on('posicao', function(data){

        // recebemos uma posição :D
        // envie para todos os peers da room 'mapas'
        socket.broadcast.to('mapas').emit('posicao', {
            id : socket.id,
            pos: data.pos,
            nome: data.nome
        });
    });

    socket.on('mapa', function(){
        // sou um mapa, me registre na room do mapa!
        socket.join('mapas');
    });
});

// só falta iniciar tudo na porta 8080
http.listen(8080);

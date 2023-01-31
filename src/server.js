import express from "express";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
// import mongoose from "mongoose";
// import Chat from './models/chat.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))


//db connection
// mongoose.connect('mongodb://localhost/chat-database')
// .then(db => console.log('db is connected'))
// .catch(err => console.log(err));

const puerto = 933
app.set('port',process.env.PORT || puerto)

let users = {}


const httpServer = app.listen(app.get('port'), ()=>{
    console.log(`Server on port`, app.get('port'));
})

const socketServer = new Server(httpServer)

socketServer.on('connection',async(socket)=>{
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('disconnect',()=>{
        console.log('Usuario desconectado');
    })

    // let messages = await Chat.find({}).limit(3)
    // socket.emit('load old msgs',messages)

    socket.on('new user',(data,cb)=>{
        // console.log(data);
        if(data in users){
            cb(false)
        }else{
            cb(true)
            socket.nickname = data
            console.log(socket.nickname);
            users[socket.nickname] = socket
            socket.broadcast.emit('broadcast', socket.nickname)
            updateNicknames()
        }
    })
    
    socket.on('send message', async(data, cb) => {
        // console.log(data);
        //substr metodo que trae desde que elemnto hasta donde(0desde,cuanto elementos3) osea se comprueba que /w y el espacio vacio sean esos tres caracteres
        var msg = data.trim()
        
        if(msg.substr(0,3)=== '/w '){
            msg = msg.substr(3)
            //busco en indice del tercer caracter que es un espacio en blanco
            var index = msg.indexOf(' ')
            if(index !== -1){
                let name = msg.substr(0, index)
                var msg = msg.substr(index+1)
                if(name in users){
                    users[name].emit('whisper', {
                        msg,
                        nick: socket.nickname
                    })
                }else {
                    cb('Error! Please enter a valid User')
                } 
            }else{
               cb('Error! Please enter your message') 
            }
        }else{
            let newMsg = new Chat({
                msg,
                nick: socket.nickname
            })
            await newMsg.save()
            
            socketServer.emit('new message', {
                msg: data,
                nick: socket.nickname
            })
            console.log(msg);
        }

    })

    socket.on('disconnect', data => {
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });

   
   const updateNicknames = () => {
        socketServer.emit('username',Object.keys(users))
   }
    
})
// import Chat from '../models/chat.js'
import $ from 'jquery';

$(function () {
    
const socket = io.connect()
    
    //Dom Elements
    const $messageForm = $('#message-form')
    const $messageBox = $('#message')
    const $chat = $('#chat')
    //imgs
    
    const $divImgInicial = $('#divImgInicial')
    const $divImgPosterior = $('#divImgPosterior')

    const $nickForm = $('#nickForm')
    const $nickError = $('#nickError')
    const $nickname = $('#nickname')

    const $users = $('#usernames')

    $nickForm.submit((e) =>{
        e.preventDefault()
        // console.log('Enviando...');
        socket.emit('new user',$nickname.val(), data => {
            console.log(data);
            // if($nickname.val()  === ''){
            //     $nickError.html(`
            //         <div class="alert alert-danger">
            //         <p class="alert alert-danger"><b>Error!</b>
            //         enter a user</p>
            //         </div>
            //         `)
            // }else{
                if(data){
                    $('#nickWrap').hide()
                    $('#contentWrap').show()
                    // document.querySelector("#contentWrap").style.display = "flex";
                    if($('#contentWrap').show()){
                        $('#divNone').show()
                        $divImgInicial.hide()
                        $("message").focus()
                        // $divImgPosterior.show()
                    }
                }else{
                    $nickError.html(`
                    <div class="alert alert-danger">
                        That username already exits
                    </div>
                    `)
                }
            // }
        })
        $nickname.val('') 
    })

    //Events
    $messageForm.submit((e) =>{
        e.preventDefault()
        socket.emit('send message', $messageBox.val(), data =>{
            $chat.append(`<p class="error">${data}</p>`)
        })
        $messageBox.val('') 
        
    })

    socket.on('new message', (data) =>{
        $chat.append(`<b>`+ data.nick + `</b>:` + data.msg + '<br/>' )
    })

    socket.on('username',data =>{
        console.log(data);
        // if(data ==){
        //     data === false
        //     console.log('Debes ingresar un usuario válido');
        // }else{
            let htmlText = ''
            for(let i = 0; i < data.length; i++){
                htmlText += `<p><i class="fas fa-user"></i> ${data[i]}</p>` 
            // }
            $users.html(htmlText)
        }
    })

    socket.on('whisper', data =>{
        $chat.append(`<p class ="whisper"><b>${data.nick}:</b>${data.msg}</p>`)
    })

    socket.on('broadcast',nombreUsuario =>{
        // console.log(nombreUsuario);
        Toastify({
            //metodo para que tome el primer caracter, despues pase todo a mayuscula y por ultimo extrae todos dejando solo el primer caracter el  cual queda en mayuscula
            //${nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1)}
            text:`${nombreUsuario} ingreso al ChatPIrate`,
            duration: 5000,
            position:'right'
        }).showToast()
    })
    
    
    socket.on('load old msgs', data =>{
        for (let i = 0; i < data.length; i++)
        displayMsg(data[i])
    })
    const displayMsg = (data) => {
        $chat.append(`<p class="whisper"><b>${data.nick}: </b> ${data.msg}</p> `)
    }

})


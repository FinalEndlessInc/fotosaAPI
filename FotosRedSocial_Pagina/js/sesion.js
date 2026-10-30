//Iniciar sesion
const Input_Usuario = document.querySelector("#Input_Usuario");
const Input_Contrasena = document.querySelector("#Input_Contrasena");


//Sesion
const SeccionIniciarSesion= document.querySelector("#SeccionIniciarSesion");
const SeccionSesionIniciada = document.querySelector("#SeccionSesionIniciada");

const TextoMiPerfil = SeccionSesionIniciada.querySelector("#TextoMiPerfil");
const ImagenPerfil = SeccionSesionIniciada.querySelector("img");

function HacerLogin(){
    const objeto = {
        usuario: Input_Usuario.value,
        contrasena: Input_Contrasena.value
    }

    fetch(url_endpoint + "/login", {
        method: "POST",
        body: JSON.stringify(objeto)
    }).then(recurso => {
        recurso.json().then(respuesta => {
            if(recurso.status == 200){
                console.log(respuesta);
                sessionStorage.setItem("token_sesion", respuesta.token);
                ObtenerUsuario();
                return;
            }
            //alert(respuesta.mensaje);
        });
    });
}

ObtenerUsuario();

function ObtenerUsuario(){
    fetch(url_endpoint + "/obtener_usuario", {
        method: "GET",
        headers: {
            authorization: sessionStorage.getItem("token_sesion")
        }
    }).then(recurso => {
        recurso.json().then(respuesta => {
            if(recurso.status != 200){
                alert(respuesta.mensaje);
                return;
            }
            SeccionIniciarSesion.remove();
            SeccionSesionIniciada.style.display = "block";

            TextoMiPerfil.innerHTML = respuesta.usuario;
            ImagenPerfil.src = respuesta.imagen;

            sessionStorage.setItem("muro_objetivo", respuesta.id);
             
        });
    });
    
}

function VerMiMuro(){
    window.location.href = "muro.html";
}

function CerrarSesion(){
    sessionStorage.removeItem("token_sesion");
    window.location.href = "index.html";
}
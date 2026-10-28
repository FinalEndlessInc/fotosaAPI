const Input_Usuario = document.querySelector("#Input_Usuario");
const Input_Contrasena = document.querySelector("#Input_Contrasena");

const SeccionIniciarSesion= document.querySelector("#SeccionIniciarSesion");
const SeccionSesionIniciada = document.querySelector("#SeccionSesionIniciada");

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
                sessionStorage.setItem("token_sesion", respusta.token);
                ObtenerUsuario();
                return;
            }
            alert(respuesta.mensaje);
        });
    });
}

function ObtenerUsuario(){
    SeccionIniciarSesion.remove();
    SeccionSesionIniciada.style.display = "block";
}
const Input_Correo = document.querySelector("#Input_Correo");
const Input_Nombre = document.querySelector("#Input_Nombre");
const Input_Contrasena = document.querySelector("#Input_Contrasena");
const Input_ContrasenaConfirmacion = document.querySelector("#Input_ContrasenaConfirmacion");
const Input_Imagen = document.querySelector("#Input_Imagen");
const PreviewImagenPerfil = document.querySelector("#PreviewImagenPerfil");

const Input_Fondo = document.querySelector("#Input_Fondo");
const PreviewImagenFondo = document.querySelector("#PreviewImagenFondo");
const Fondo_Cover = document.querySelector("#Fondo_Cover");

Input_Imagen.addEventListener("change", function(){
    const archivo = Input_Imagen.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = function(){
        PreviewImagenPerfil.src = reader.result;
    }
});

Input_Fondo.addEventListener("change", function(){
    const archivo = Input_Fondo.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = function(){
        PreviewImagenFondo.src = reader.result;
    }
});


function Registrarse(){
    if(Input_Contrasena.value != Input_ContrasenaConfirmacion.value){
        alert("Las contraseñas no coinciden");
        window.location.reload();
        return;
    }
    const objeto_usuario = {
        nombre: Input_Nombre.value,
        correo: Input_Correo.value,
        contrasena: Input_Contrasena.value,
        imagen: PreviewImagenPerfil.src,
        fondo: PreviewImagenFondo.src,
        fondo_cover: Fondo_Cover.checked
    }

    fetch(url_endpoint + "/registro", {
        method: "POST",
        body: JSON.stringify(objeto_usuario)
    }).then(recurso => {
        recurso.json().then(respuesta => {
            if(recurso.status == 200){
                alert(respuesta.mensaje);
                window.location.href = "index.html";
                return;
            }
            alert(respuesta.mensaje);
        });
    });
}

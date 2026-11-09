const TituloMuro = document.querySelector("#TituloMuro");
const ImagenPerfilMuro = document.querySelector("#ImagenPerfilMuro");
const body = document.querySelector("body");

const plantilla_imagen = document.querySelector(".ElementoImagen");
const ColeccionImagenes = document.querySelector("#ColeccionImagenes");
plantilla_imagen.remove();


fetch(url_endpoint + "/obtener_perfil_" + sessionStorage.getItem("muro_objetivo")).then( recurso => recurso.json()).then(respuesta => {
    TituloMuro.innerHTML = "Muro de " + respuesta.nombre;
    ImagenPerfilMuro.src = respuesta.imagen;
    body.style.backgroundImage = "url('" + respuesta.fondo + "')";

    if(respuesta.fondo_cover == 1){
        body.style.backgroundSize = "cover";
    }
    
});

// Obtener las fotos
fetch(url_endpoint + "/obtener_id_fotos_" + sessionStorage.getItem("muro_objetivo")).then(recurso => recurso.json()).then(respeusta => {
    console.log(respeusta);

    for(i = 0; i < respeusta.ids.length; i++){
        const clon = plantilla_imagen.cloneNode(true);
        ColeccionImagenes.appendChild(clon);

        fetch(url_endpoint + "/obtener_foto_muro_" + respeusta.ids[i]).then(recurso => recurso.blob()).then(imagen => {
            const imagen_url = URL.createObjectURL(imagen);
            console.log(imagen_url);
            clon.style.backgroundImage = "url(" + imagen_url + ")";
        });
    }
});

const SeccionAgregarFoto = document.querySelector("#SeccionAgregarFoto");
const Campo_SubirNuevaFoto = document.querySelector("#Campo_SubirNuevaFoto");
const Preview_SubirNuevaFoto = document.querySelector("#Preview_SubirNuevaFoto");

Campo_SubirNuevaFoto.addEventListener("change", () => {
    const archivo = Campo_SubirNuevaFoto.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = function(){
        Preview_SubirNuevaFoto.src = reader.result;
    }
});

funcion_iniciar_sesion = function(id_usuario){
    if(id_usuario == sessionStorage.getItem("muro_objetivo")){
        SeccionAgregarFoto.style.display = "block";
    }
}

/*
fetch(url_endpoint + "/poder_subir_foto", {
    method: "GET",
    headers: {
        Authorization: sessionStorage.getItem("token_sesion")
    }
});*/

function AgregarNuevaFoto(){
    fetch(url_endpoint + "/agregar_foto_a_muro", {
        method: "POST",
        body: JSON.stringify({
            imagen: Preview_SubirNuevaFoto.src
        }),
        headers: {
            Authorization: sessionStorage.getItem("token_sesion")
        }
    });
}
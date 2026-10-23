const plantilla_perfil = document.querySelector(".Perfil");
const ConjuntoPerfiles = document.querySelector("#ConjuntoPerfiles");

plantilla_perfil.remove();

fetch(url_endpoint + "/obtener_id_perfiles").then(recurso => recurso.json()).then( respuesta => {
    for(i =0; i < respuesta.ids.length; i++){
        console.log(respuesta.ids[i].id);

        const clon = plantilla_perfil.cloneNode(true);
        ConjuntoPerfiles.appendChild(clon);

        const _i = respuesta.ids[i].id;

        fetch(url_endpoint + "/obtener_perfil_" + respuesta.ids[i].id).then(recurso => recurso.json()).then( resultado => {
            const nombre = clon.querySelector(".Nombre");
            nombre.innerHTML = resultado.nombre;

            const Imagen = clon.querySelector("img");
            Imagen.src = resultado.imagen;

            clon.addEventListener("click", function(){
                sessionStorage.setItem("muro_objetivo", _i);
                window.location.href = "muro.html";
            });
        });
    }
});
const http = require("node:http");
const basesdatos= require("mysql");
const jwt = require("jsonwebtoken");

const llave = "jskmfhjn9j2hf90awepoaaeffgksbyfevgbxm";

const puerto = 3000;

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "*");

    const token = request.headers['authorization'];

    const mysql = basesdatos.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "fotosredsocial2"
    });
    
    switch(request.method){
        case "GET":

            switch(request.url){
                case "/obtener_id_perfiles":
                    mysql.query("SELECT id FROM usuarios", (err, resultado) => {
                    if(err){
                        console.log(err);
                        mysql.end();
                        return;
                    }

                    const arreglo_ids =  {
                        ids: resultado
                    }
                    
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(arreglo_ids));

                    mysql.end();
                });
                break;

                case "/obtener_usuario":
                    console.log(request.headers.authorization);
                    if(!token || token == null || token == "null" || token == undefined){
                        //console.log(err);
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            mensaje: "Token no proporcionado"
                        }));
                        mysql.end();
                        return;
                    }

                    jwt.verify(token, llave, (err, decoded) => {
                        if(err){
                            console.log(err);
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Token invalido"
                                }));
                                mysql.end();
                                return;
                        }
                        console.log(decoded);
                        mysql.query("SELECT id, imagen FROM usuarios WHERE nombre = '" + decoded.username +"'", (err, resultado) => {
                            if(err){
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Algó salio mal"
                                }));
                                mysql.end();
                                return;
                            }
                            const objeto_respuesta = {
                                id: resultado[0].id,
                                usuario: decoded.username,
                                imagen: "data:;base64," + resultado[0].imagen.toString("base64")
                            }

                            //console.log(objeto_respuesta);

                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_respuesta));

                            mysql.end();
                        });
                    });
                break;

                default:
                    if(request.url.startsWith("/obtener_perfil_")){
                        const id = request.url.replace("/obtener_perfil_", "");
                        mysql.query("SELECT nombre, imagen, fondo, fondo_cover FROM usuarios WHERE id = " + id, (err, respuesta) => {
                            if(err){
                                console.log(err);
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Error, no vale esa peticion"
                                }));
                                mysql.end();
                                return;
                            }

                            if(respuesta.length == 0){
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No existe un usuario con ese id"
                                }));
                                mysql.end();
                                return;
                            }
                            
                            const perfil = {
                                nombre: respuesta[0].nombre,
                                imagen: "data:;base64," + respuesta[0].imagen.toString("base64"),
                                fondo_cover: respuesta[0].fondo_cover
                            }

                            if(respuesta[0].fondo == null){
                                perfil.fondo = null
                            }else{
                                perfil.fondo = "data:;base64," + respuesta[0].fondo.toString("base64")
                            }

                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(perfil));
                            mysql.end();
                        });
                    }
                    else if(request.url.startsWith("/obtener_id_fotos_")){
                        const id = request.url.replace("/obtener_id_fotos_", "");
                        
                        mysql.query("SELECT id FROM `fotos` WHERE id_usuario = " + id, (err, resultado) => {
                            if(err){
                                console.log(err);
                                mysql.end();

                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No existe un usuario con ese id"
                                }));

                                return;
                            }

                            const ids_fotos = {
                                "ids": []
                            }

                            for(i = 0; i < resultado.length; i++){
                                ids_fotos.ids.push(resultado[i].id)
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(ids_fotos));
                            mysql.end();
                        })
                    }
                    else if(request.url.startsWith("/obtener_foto_muro_")){
                        const id = request.url.replace("/obtener_foto_muro_", "");
                        mysql.query("SELECT imagen FROM fotos WHERE id=" + id,(err, resultado) => {
                            if(err){
                                console.log(err);
                                mysql.end();

                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No pude obtener una imagen con este id"
                                }));
                                return;
                            }
                            if(resultado.length == 0){
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No hay imagen con ese id"
                                }));
                                return;
                            }
                            /*const respuesta = {
                                imagen: "data:;base64" + resultado[0].imagen.toString("base64")
                            }*/

                            response.statusCode = 200;
                            response.end(resultado[0].imagen);
                            mysql.end();
                        });
                    }           
                break;
            }
            
            
        break;
        case "POST":
            var informacion = "";
            request.on("data", info => {
                informacion += info;
            });
            request.on("end", () => {
                switch(request.url){
                
                    case "/login":
                        //console.log("intentamos iniciar sesion");
                        const login = JSON.parse(informacion);                        

                        mysql.query("SELECT nombre FROM usuarios WHERE (nombre = '" + login.usuario + "' AND contrasena = '"+ login.contrasena +"') OR (correo = '"+ login.usuario+ "' AND contrasena = '"+login.contrasena+"')", (err, resultado) => {
                            if(err){
                                mysql.end();
                                console.log("hay un error");
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Algo fallo, informacion erronea"
                                }));
                                return;
                            }


                            if(resultado.length == 0){
                                mysql.end();
                                console.log("Usuario o contraseña incorrecto");
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Usuario o contraseña incorrecto"
                                }));
                                return;
                            }

                            const token = jwt.sign({username: resultado[0].nombre}, llave, {expiresIn: "1h"});

                            mysql.end();
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                mensaje: "Login exitoso",
                                token: token
                            }));

                        });
                    break;

                    case "/registro":
                        const objeto_registro = JSON.parse(informacion);
                        
                        mysql.query("SELECT correo FROM usuarios WHERE (correo = '"+ objeto_registro.correo + "') OR (nombre = '"+ objeto_registro.nombre +"') ", (err, resultado) => {
                            if(err){
                                mysql.end();
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Error en la consulta",
                                }));
                                return;
                            }

                            if(resultado.length != 0){
                                mysql.end()
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Correo o nombre proporcionado ya registrado en la base de datos",
                                
                                }));
                                return;
                            }

                            var imagen_binario;
                            var fondo_binario;

                            try{
                                imagen_binario = Buffer.from(objeto_registro.imagen.split(',')[1], "base64");

                                if(objeto_registro.fondo == ""){
                                    fondo_binario = null;
                                }else{
                                    fondo_binario = Buffer.from(objeto_registro.fondo.split(',')[1], "base64");
                                }
                            }catch(err){
                                console.log(err);
                                mysql.end();
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Error con las imagenes que se mandaron",
                                
                                }));
                                return;
                            }


                            mysql.query("INSERT INTO usuarios (nombre, correo, contrasena, imagen, fondo, fondo_cover) VALUES (?,?,?,?,?,?)", [objeto_registro.nombre, objeto_registro.correo, objeto_registro.contrasena, imagen_binario, fondo_binario, objeto_registro.fondo_cover], (err, resultado) => {
                                if(err){
                                    console.log(err);
                                    mysql.end();
                                    response.statusCode = 400;
                                    response.setHeader('Content-Type', 'application/json');
                                    response.end(JSON.stringify({
                                        mensaje: "Ocurrió un error al intentar registrarse",
                                    
                                    }));
                                    return;
                                }
                                mysql.end()
                                response.statusCode = 200;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Usuario creado correctamente"
                                }));
                                return;
                            });
                        });
                    break;

                    case "/agregar_foto_a_muro":
                        const nueva_imagen = JSON.parse(informacion);
                        
                        if(!token || token == null || token == "null" || token == undefined){
                            mysql.end();
                            response.statusCode = 400;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                mensaje: "Token no proporcionado",
                            }));
                            return;
                        }

                        jwt.verify(token, llave, (err, decoded) => {
                            if(err){
                                mysql.end();
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Ocurrió un error al intentar registrarse",
                                
                                }));
                                return;
                            }

                            mysql.query("SELECT id FROM usuarios WHERE nombre = ?", [decoded.username], (err, resultado) => {
                                if(err){
                                    console.log(err);
                                    mysql.end();
                                    return;
                                }

                                const imagen_binario = Buffer.from(nueva_imagen.imagen.split(",")[1], "base64");

                                mysql.query("INSERT INTO fotos (imagen, id_usuario) VALUES (?,?)", [imagen_binario, resultado[0].id], (err, resultado2) => {
                                    if(err){
                                        console.log(err);
                                        mysql.end();
                                        return;
                                    }

                                    mysql.end();
                                    response.statusCode = 201;
                                    response.setHeader('Content-Type', 'application/json');
                                    response.end(JSON.stringify({
                                        mensaje: "Imágen agregada al muro",
                                    
                                    }));
                                    return;
                                });
                            });
                        });

                    break;
                }
            });
            
            
        break;
        case "PUT":
            
        break;
        case "OPTIONS":
            response.writeHead(204);
            response.end();
        break;
    }

    /*
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({}));
    */
});

server.listen(puerto, () =>{
    console.log("Servidor a la escucha en http://localhost:" + puerto);
});
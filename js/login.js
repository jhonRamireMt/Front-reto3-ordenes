

function logIn(e){
   e.preventDefault();
    if($("#login-email").val() == "" || $("#login-password").val() == ""){
        alert("Todos los campos son obligatorios");
    }else{
        let email = $("#login-email").val()
        let password = $("#login-password").val()  
        $.ajax({
            dataType:"json",
            typ:"GET",
            url: "http://144.22.57.2:8083/api/user/"+email+"/"+password,
            success:function(json){
                
                if(json.id == null || json.name == null){
                    $("#inicio-fail").empty();
                    $("#inicio-ok").empty();
                    $("#inicio-fail").append("Error al iniciar sesion: usuario o contraseña incorrecto");
                }else{
                    $("#inicio-fail").empty();
                    $("#inicio-ok").empty();
                    $("#inicio-ok").append(json.name + " ha iniciado sesion")
                    console.log(json)
                    alertify.success("Bienvenido al sistema "+json.name);
                        alertify.success("Estamos direccionanado...");
                    if(json.type == "ADM"){
                        sessionStorage.setItem("ID",json.id);
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        redireccionarAdmin();
                        
                    }if(json.type == "COORD"){
                        sessionStorage.setItem("ID",json.id);
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        redireccionarCordinardor();
                        
                    }if(json.type == "ASE"){
                        sessionStorage.setItem("ID",json.id);
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        alertify.success("Bienvenido al sistema "+json.name);
                        redireccionarAsesor();
                    }
                    
                }    
            }
        }) 
    }
}

// funcion para retardar el cargado de la administradores
function redireccionarAdmin(){
    function retrasarCarga() {
        window.location="./admin.html"; 
      }
      setTimeout(retrasarCarga, 2500);
}

// funcion para retardar el cargado de la cordinadores
function redireccionarCordinardor(){
    function retrasarCarga() {
        window.location.href = "./coord.html";
      }
      setTimeout(retrasarCarga, 2500);
}

// funcion para retardar el cargado de la asesores
function redireccionarAsesor(){
    function retrasarCarga() {
        window.location="./asesores.html"; 
      }
      setTimeout(retrasarCarga, 2500);
}




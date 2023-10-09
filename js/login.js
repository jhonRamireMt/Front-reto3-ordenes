

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
            url: "http://localhost:8085/api/user/"+email+"/"+password,
            success:function(json){
                
                if(json.id == null || json.name == null){
                    $("#inicio-fail").empty();
                    $("#inicio-ok").empty();
                    $("#inicio-fail").append("Error al iniciar sesion: usuario o contrUSRña incorrecto");
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
                        
                    }if(json.type == "DOC"){
                        sessionStorage.setItem("ID",json.id);
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        redireccionarMedico();
                        
                    }if(json.type == "USR"){
                        sessionStorage.setItem("ID",json.id);
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        alertify.success("Bienvenido al sistema "+json.name);
                        redireccionarUsuarios();
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
function redireccionarMedico(){
    function retrasarCarga() {
        window.location.href = "./doctores.html";
      }
      setTimeout(retrasarCarga, 2500);
}

// funcion para retardar el cargado de la USRsores
function redireccionarUsuarios(){
    function retrasarCarga() {
        window.location="./usuarios.html"; 
      }
      setTimeout(retrasarCarga, 2500);
}




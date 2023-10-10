// metodo on de jquery - mapea la fila
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

let usuarioAutenticado = sessionStorage.getItem("ROL");
let hoy = new Date();
let fecha =
  hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds(); // esta es otra forma de escibir la fecha actual
let nuevaFecha = new Date(); // este es el formato de fecha que estoy usando actualmente
console.log(fecha + "-" + hora+".000+00:00");
let id = 0;


//MOSTRAR PRODUCTOS EN LA LISTA DE AGREGADOS
const mostrarOrdenProductos = (producto) => {
  let filas = "";
  //let columnas = "";
  $("#tbody").empty();
  columnas = `<tr class="text-center">
        <th>CODIGO</th>
        <th>MEDICO</th>
        <th>CATEGORIA</th>
        <th>ESPECIALIDAD</th>
        <th>DESCRIPCION</th>
        <th>PRECIO</th>
        <th>FECHA</th>
        <th>ELIMINAR</th>
      </tr>`;
  filas = "";
  for (let item of producto) {
    filas += "<tr>";
    filas += "<td>" + item.reference;
    filas += "<td>" + item.name;
    filas += "<td>" + item.category;
    filas += "<td>" + item.speciality;
    filas += "<td>" + item.description;
    filas += "<td>" + item.price;
    filas += "<td>" + item.date;
    filas += ` <td class="text-center"><a class="btnBorrarOrden btn btn-danger">ELIMINAR</a></td></tr>`;
  }
  $("#tbody").append(columnas + filas);
};

// EJECUTA TODOS LOS DATOS PARA REALIZAR UN PEDIDO
function llenarObjeto() {
  let userData = sessionStorage.getItem("SALESMAN");
  let prodEnCompra = sessionStorage.getItem("PRODUCTOS");
  
  //console.log(JSON.parse(prodEnCompra));
  //console.log(JSON.parse(userData));

  //localStorage.setItem("ORDEN-COMPRA",JSON.stringify(myData))
}

//llenarObjeto();

function realizarPedido() {
  recuperarQuantity();
  let userData = sessionStorage.getItem("SALESMAN");
  let prodEnCompra = sessionStorage.getItem("PRODUCTOS");
  //let cantidad = sessionStorage.getItem("CANTIDAD")
  //let nuevaCantidad = JSON.parse(cantidad);
  let nuevaCompra = JSON.parse(prodEnCompra);
  let user = JSON.parse(userData);
  objetoProductos = Object.assign({}, nuevaCompra);
  //id= id+1;
  let myData = {
    //id:id,
    registerDay: nuevaFecha,
    salesMan: user,
    products: objetoProductos,
    //quantities:nuevaCantidad
  };
  let dataToSend = JSON.stringify(myData);
  console.log(dataToSend)
  $.ajax({
    url: "http://54.236.4.112:8085/api/order/new",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: dataToSend,
    success: function (json) {
      alertify
      .alert("El codigo de de tu cita es: AC-" +json.id, function(){
      alertify.message("Cita: "+json.id+" asiganada correctamente");
  });
      alertify.success("Cita Programada satisfactoriamente!");
    },
  });
}




// CAPTURA EL VALOR DE REFERENCIA Y CANTIDAD DEL INPUT
on(document, "keyup", "#inputPedido", (e) => {
  let fila = e.target.parentNode.parentNode;
  let indetificador = fila.firstElementChild.innerHTML;
  let input = fila.children[6].querySelector("#inputPedido").value;
  let inputParse = parseInt(input); // se realiza el parseo a entero
  sessionStorage.setItem(`${indetificador}`, inputParse);
});

//RECUPERAR quantity

function recuperarQuantity() {
  let llave = [];
  let valor = [];
  let union =[];
  objeto = {};
  for (i = 0; i < localStorage.length ; i++) {
    llave[i] = localStorage.key(i); // se obtiene el nobre de cada llave

    //VALOR ES UN ARRAY QUE TENDRA DE TAMAÑAO NO UN ENTERO SINO LA CANTIDAD DE LLAVES ENCONTRADAS
    valor[llave[i]] = parseInt(sessionStorage.getItem(llave[i])); // se obtiene el valor de cada llave parsean a int
    //console.log(llave)
    //console.log(valor)
    objeto = Object.assign({},valor)
    //console.log(objeto)
    sessionStorage.setItem("CANTIDAD",JSON.stringify(objeto))
  }
}



// OBTIENE LOS PRODUCTOS AGREGADOS EN UNION Y LOS RENDERIZA EN LA LISTA
function obtenerAlmacenamiento() {
  let llave = [];
  let union = []
  let nombreIndex = []
  let objeto ={}
  
  for (i = 0; i < localStorage.length; i++) {
    llave[i] = localStorage.key(i);
    $.ajax({
      url: "http://54.236.4.112:8085/api/product/" + llave[i],
      type: "GET",
      dataType: "json",
      success: function (json) {
        union.push(json);
        console.log(union)
        mostrarOrdenProductos(union);
        nombreIndex[json.reference] = json
        objeto = Object.assign({},nombreIndex)
        sessionStorage.setItem("PRODUCTOS",JSON.stringify(objeto))
           
      },
    });
  }

  
  // OBTENER EL SALESMAN
  let identidad = parseInt(sessionStorage.getItem("ID"));
  $.ajax({
    url: "http://54.236.4.112:8085/api/user/" + identidad,
    type: "GET",
    dataType: "json",
    success: function (salesMan) {
      sessionStorage.setItem("SALESMAN", JSON.stringify(salesMan)); // salesMan
    },
  });
}

// QUITAR UN PRODUCTO DE LA ORDEN
on(document, "click", ".btnBorrarOrden", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
 // console.log(id);
  alertify.confirm(
    "Esta eliminando la cita programada. Desea continuar?",
    function () {
      localStorage.removeItem(id);
      alertify.success("Cita Cancelada!");
      retardar();
    },
    function () {
      alertify.error("Cita Cancelada.");
    }
  );
});

// validacion de cargue de pagina - solo permite rol ADM
if (usuarioAutenticado == "USR") {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  obtenerUsuario(a);
}

// cerrar sesion del usuario
function cerrarSesion() {
  alertify.confirm(
    "Se terminara la sesion actual. Desea continuar?",
    function () {
      sessionStorage.removeItem("ROL");
      alertify.success("Vuelve pronto!");
      retardar();
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
}

//mostrar usuarios en el header
function obtenerUsuario(b) {
  $("#nombreUser").html(sessionStorage.getItem("NOMBRE"));
  $("#rolUser").html(sessionStorage.getItem("ROL"));
  $("#sesionRol").html(sessionStorage.getItem("ROL"));
  $("#sesionZona").html(sessionStorage.getItem("ZONA"));
  $("#sesionTel").html(sessionStorage.getItem("TELEFONO"));
  $("#sesionDir").html(sessionStorage.getItem("DIRECCION"));
  $("#sesionCorreo").html(sessionStorage.getItem("CORREO"));
  $("#sesionNombre").html(sessionStorage.getItem("NOMBRE"));
  let nombre = document.getElementById("NOMBRE");
}

// funcion para retardar el cargado de la pagina
function retardar() {
  function retrasarCarga() {
    location.reload();
  }
  setTimeout(retrasarCarga, 2000);
}

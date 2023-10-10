let usuarioAutenticado = sessionStorage.getItem("ROL");
// validacion de cargue de pagina - solo permite rol
if (usuarioAutenticado == "DOC") {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  console.log(a);
  obtenerUsuario(a);
}

//mostrar elelemtos en la tabla
const mostrarEstadoOrdenCompra = (producto) => {
  let filas = "";
  $("#tbodyEstado").empty();
  producto.forEach((item) => {
    columnas = `<tr class="text-center align-items-script">
    <th>FECHA</th>
    <th>No. CITA</th>
    <th>ESTADO</th>
    <th>CAMBIAR ESTADO</th>
    <th>GUARDAR</th>
    </tr>`;
    filas += `
    <tr>
    <td>${item.registerDay}</td>
    <td>${item.id}</td>
    <td>${item.status}</td>
    <td class="text-center"><select id="cambiarEstado" class="btnVerPedido "> <option selected>:</option>
    <option value="Pendiente">Pendiente</option>
    <option value="Aprobado">Aprobado</option>
    <option value="Rechazado">Rechazado</option></select></td>
    <td class="text-center"><a onclick="enviarCambiarEstado" class="enviarCambioEstado  btn btn-success" >Guardar Estado</a></td>
    </tr>
    `;
  });
  $("#tbodyEstado").append(columnas + filas);
};

const mostrarDetallePedido = (json) => {
  let filas = "";
  let iteradorInteriorProducts = Object.values(json.products)
  columnas = `<tr class="text-center align-items-script">
    <th>MEDICO</th>
    <th>CODIGO CITA</th>
    <th>CATEGORIA</th>
    <th>ESPECIALIDAD</th>
    <th>DESCRIPCION</th>
    </tr>`;

  for(let i =0; i<iteradorInteriorProducts.length; i++){
    filas += "<tr>"
    filas +="<td>"+iteradorInteriorProducts[i].name;
    filas +="<td>"+iteradorInteriorProducts[i].reference;
    filas +="<td>"+iteradorInteriorProducts[i].category;
    filas +="<td>"+iteradorInteriorProducts[i].speciality;
    filas +="<td>"+iteradorInteriorProducts[i].description; 
 }
  $("#tbody").append(columnas + filas);
};

// metodo on de jquery - mapea la fila
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};


// OBJETO QUE ME AYUDA A CAPTURAR LOS VALORES DE LA FILA POR #ID
on(document, "click", ".enviarCambioEstado", (e) => {
  const fila = e.target.parentNode.parentNode;

  const fecha = fila.children[0].innerHTML;
  const numPedido = fila.children[1].innerHTML;
  const estado = fila.children[2].innerHTML;
  const selectEstado = fila.children[3].querySelector("#cambiarEstado").value;
  botonGuardar = fila.children[4].innerHTML;
  enviarCambiarEstado(numPedido,selectEstado)
  console.log(fecha,numPedido,estado,selectEstado);
  
});

function enviarCambiarEstado(numPedido,selectEstado){
let objeto ={}
  $.ajax({
    url: "http://localhost:8085/api/order/"+numPedido,
    type: "GET",
    dataType: "json",
    success: function (json) {
      objeto = {
        id : numPedido, 
        Date: json.Date,
        status: selectEstado,
        salesMan:json.salesMan,
        products: json.products,
        quantities: json.quantities
      }
      let dataToSend = JSON.stringify(objeto);
      console.log(dataToSend)
      $.ajax({
        url: "http://localhost:8085/api/order/update",
        type: "PUT",
        contentType: "application/json",
        dataType: "json",
        data:dataToSend,
        success: function (json){
          alertify.success("Estado del pedido No "+json.id +" ha sido actualizado!!");
          retardar()
        }
      })
    },
  });
}

//metodo para agregar un producto a la orden de compra
function obtenerOrdenDetalle(){
  let array =[]
  numPedido = sessionStorage.getItem("NUM-PEDIDO")
  $.ajax({
    url: "http://localhost:8085/api/order/"+numPedido,
    type: "GET",
    dataType: "json",
    success: function (json) {
      array.push(json)
      //console.log(json);
      //console.log(array)
      mostrarDetallePedido(json);
      mostrarEstadoOrdenCompra(array);
    },
  });
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

// cerrar sesion del usuario
function cerrarSesion() {
  alertify.confirm(
    "Se terminara la sesion actual. Desea continuar?",
    function () {
      sessionStorage.removeItem("ROL");
      retardarCierreSesion();
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
}

function retardarCierreSesion() {
  alertify.success("Vuelve pronto!");
  function retrasarCarga() {
    location.reload();
  }
  setTimeout(retrasarCarga, 2000);
}

function retardar() {
  function retrasarCarga() {
    location.reload();
  }
  setTimeout(retrasarCarga, 2000);
}
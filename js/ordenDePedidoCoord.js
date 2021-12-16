let usuarioAutenticado = sessionStorage.getItem("ROL");
// validacion de cargue de pagina - solo permite rol
if (usuarioAutenticado == "COORD") {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  console.log(a);
  obtenerUsuario(a);
}

const mostrarDetallePedido = (json) => {
  let filas = "";
  let iteradorInteriorProducts = Object.values(json.products)
  let iterarQuantities = Object.values(json.quantities)
  console.log(iterarQuantities)
  columnas = `<tr class="text-center align-items-script">
    <th>FOTO</th>
    <th>NOMBRE</th>
    <th>CATEGORIA</th>
    <th>DESCRIPCION</th>
    <th>PRECIO</th>
    <th>CANTIDAD</th>
    <th>STOCK</th>
    </tr>`;

  for(let i =0; i<iteradorInteriorProducts.length; i++){
    console.log(iterarQuantities)
    filas += "<tr>"
    filas +="<td>"+iteradorInteriorProducts[i].photography;
    filas +="<td>"+iteradorInteriorProducts[i].reference;
    filas +="<td>"+iteradorInteriorProducts[i].category;
    filas +="<td>"+iteradorInteriorProducts[i].description 
    filas +="<td>"+iteradorInteriorProducts[i].price;
    filas +="<td>"+iterarQuantities[i];
    filas +="<td>"+iteradorInteriorProducts[i].quantity;
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

//metodo para agregar un producto a la orden de compra


function obtenerOrdenDetalle(){
  let array =[]
  numPedido = sessionStorage.getItem("NUM-PEDIDO")
  $.ajax({
    url: "http://144.22.57.2:8083/api/order/"+numPedido,
    type: "GET",
    dataType: "json",
    success: function (json) {
      array.push(json)
      //console.log(json);
      //console.log(array)
      mostrarDetallePedido(json);
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
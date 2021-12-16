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

//mostrar elelemtos en la tabla
const mostrarListaPorZona = (producto) => {
  let filas = "";
  $("#tbody").empty();
  producto.forEach((item) => {
    columnas = `<tr class="text-center align-items-script">
    <th>IDENTIFICACION</th>
    <th>NOMBRES</th>
    <th>EMAIL</th>
    <th>FECHA</th>
    <th>No. PEDIDO</th>
    <th>ESTADO</th>
    <th>PEDIDO</th>
    </tr>`;
    filas += `
    <tr>
    <td>${item.salesMan.identification}</td>
    <td>${item.salesMan.name}</td>
    <td>${item.salesMan.email}</td>
    <td>${item.registerDay}</td>
    <td>${item.id}</td>
    <td>${item.status}</td>
    <td class="text-center"><a onclick="irPedidoDetalle()" class="btnVerPedido  btn btn-primary">Ver Pedido</a></td>
    </tr>
    `;
  });
  $("#tbody").append(columnas + filas);
};


// OBTIENE LAS ORDENES CREADAS POR EL ASESOR DE ESA ZONA
function getProductos() {
  let zona = sessionStorage.getItem("ZONA");
  $.ajax({
    url: "http://localhost:8083/api/order/zona/" + zona,
    type: "GET",
    dataType: "json",
    success: function (json) {
      console.log(json);
      mostrarListaPorZona(json);
    },
  });
}

// metodo on de jquery - mapea la fila
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

//metodo para agregar un producto a la orden de compra
let numPedido = 0;
on(document, "click", ".btnVerPedido", (e) => {
  const fila = e.target.parentNode.parentNode;

  const identificacion = fila.children[0].innerHTML;
  const nombres = fila.children[1].innerHTML;
  const email = fila.children[2].innerHTML;
  const fecha = fila.children[3].innerHTML;
  numPedido = fila.children[4].innerHTML;
  const estado = fila.children[5].innerHTML;
  const botonVerPedido = fila.children[6].innerHTML;
  console.log(numPedido);
  sessionStorage.setItem(`NUM-PEDIDO`, numPedido)

});



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

function irPedidoDetalle(){
  window.location="./coordOrdenDePedido.html";
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

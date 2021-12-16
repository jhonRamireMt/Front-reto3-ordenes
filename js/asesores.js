let usuarioAutenticado = sessionStorage.getItem("ROL");




//mostrar elelemtos en la tabla
const mostrarListaProductos = (producto) => {
  let filas = "";
  $("#tbody").empty();
  producto.forEach((item) => {
    columnas = `<tr class="text-center align-items-script">
    <th>REF</th>
    <th>MARCA</th>
    <th>CATEGORIA</th>
    <th>MATERIALES</th>
    <th>DIMENSIONES</th>
    <th>DESCRIPCION</th>
    <th>DISPO</th>
    <th>PRECIO</th>
    <th>CANTIDAD</th>
    <th>IMAGEN</th>
    <th>AGREGAR</th>
    </tr>`;
    filas += `
    <tr>
    <td>${item.reference}</td>
    <td>${item.brand}</td>
    <td>${item.category}</td>
    <td>${item.materiales}</td>
    <td>${item.dimensiones}</td>
    <td>${item.description}</td>
    <td>${item.availability}</td>
    <td>${item.price}</td>
    <td>${item.quantity}</td>
    <td>${item.photography}</td>
    <td class="text-center"><a class="btnAgregar btn btn-danger">Agregar</a></td>
    </tr>
    `;
  });
  $("#tbody").append(columnas + filas);
};


// peticion ajax que trae los productos
function getProductos() {
  $.ajax({
    url: "http://localhost:8083/api/cookware/all",
    type: "GET",
    dataType: "json",
    success: function (json) {
      console.log(json)
      mostrarListaProductos(json);
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
let referenciaFila = "";
on(document, "click", ".btnAgregar", (e) => {
  const fila = e.target.parentNode.parentNode;
  
  referenciaFila = fila.children[0].innerHTML;
  const marcaFila = fila.children[1].innerHTML;
  const categoriaFila = fila.children[2].innerHTML;
  const materialesFila = fila.children[3].innerHTML;
  const dimensionesFila = fila.children[4].innerHTML;
  const descripcionFila = fila.children[5].innerHTML;
  const disponibilidadFila = fila.children[6].innerHTML;
  const precioFila = fila.children[7].innerHTML;
  const cantidadFila = fila.children[8].innerHTML;
  const fotoFila = fila.children[9].innerHTML;
  let newProducto = {
    reference: referenciaFila,
    brand: marcaFila,
    category: categoriaFila,
    materiales: descripcionFila,
    dimensiones: precioFila,
    description:descripcionFila,
    availability:disponibilidadFila,
    price:precioFila,
    quantity:cantidadFila,
    photography:fotoFila
  };

  localStorage.setItem(`${referenciaFila}`, JSON.stringify(newProducto));
  alertify.success("Producto agregado a Orden de Compra");
});


// validacion de cargue de pagina - solo permite rol ADM
if (usuarioAutenticado == "ASE") {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  console.log(a);
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

//borrar un producto
function borrarElemento(id) {
  $.ajax({
    url: "http://localhost:8082/api/cookware/"+id,
    type: "DELETE",
    dataType: "json",
    contentType: "application/json",
    success: function () {
      alertify.success("Producto borrado correctamante!");
      retardar();
    },
  });
}

//registrar un usuario
function crearProducto(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
      reference: d.getElementById("crearReferencia").value,
      brand: d.getElementById("crearMarca").value,
      category: d.getElementById("crearCategoria").value,
      materiales: d.getElementById("crearMateriales").value,
      dimensiones: d.getElementById("crearDimensiones").value,
      description: d.getElementById("crearDescripcion").value,
      availability: d.getElementById("crearDisponibilidad").value,
      price: d.getElementById("crearPrecio").value,
      quantity: d.getElementById("crearCantidad").value,
    };
    let dataToSend = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:8082/api/cookware/new",
      type: "POST",
      contentType: "application/json",
      data: dataToSend,
      success: function () {
        modalProducto.hide();
        alertify.success("Producto creado correctamante !!");
        retardar();
      },
    });
  });
}

//registrar un usuario
function editarProducto(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
      reference: referenciaForm,
      brand: d.getElementById("editarMarca").value,
      category: d.getElementById("editarCategoria").value,
      materiales: d.getElementById("editMateriales").value,
      dimensiones: d.getElementById("editDimensiones").value,
      description: d.getElementById("editDescripcion").value,
      availability: d.getElementById("editarDisponibilidad").value,
      price: d.getElementById("editPrecio").value,
      quantity: d.getElementById("editCantidad").value,
    };
    let dataToSend = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:8082/api/cookware/update",
      type: "PUT",
      contentType: "application/json",
      data: dataToSend,
      success: function () {
        modalEdit.hide();
        alertify.success("Producto Actualizado correctamente !!");
        retardar();
      },
    });
  });
}
// funcion para retardar el cargado de la pagina
function retardar() {
  function retrasarCarga() {
    location.reload();
  }
  setTimeout(retrasarCarga, 2000);
}

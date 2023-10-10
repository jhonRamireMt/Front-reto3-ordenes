let usuarioAutenticado = sessionStorage.getItem("NOMBRE");
const contenedor = document.querySelector("tbody");
const modalProducto = new bootstrap.Modal(
  document.getElementById("modalProducto")
);
const modalEdit = new bootstrap.Modal(document.getElementById("modalEditProducto"));
//const fromulario = document.getElementById("form-usuarios");
let referencia = document.getElementById("crearReferencia");
let nombre = document.getElementById("crearNombre");
let categoria = document.getElementById("crearCategoria");
let especialidad = document.getElementById("crearEspecialidad");
let descripcion = document.getElementById("crearDescripcion");
let disponibilidad = document.getElementById("crearDisponibilidad");
let precio = document.getElementById("crearPrecio");
let fecha = document.getElementById("crearFecha");
let opcion = "";
let resultados = "";

//mostrar elelemtos en la tabla
const mostrar = (producto) => {
    producto.forEach((item) => {
    resultados += `
                <tr>
                    <td>${item.reference}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.speciality}</td>
                    <td>${item.description}</td>
                    <td>${item.availability}</td>
                    <td>${item.price}</td>
                    <td>${item.date}</td>
                    <td class="text-center"><a class="btnBorrar btn btn-danger">borrar</a></td>
                    <td class="text-center"><a class="btnEditar btn btn-primary">editar</a></td>
                </tr>
            `;
  });
  contenedor.innerHTML = resultados;
};

// metodo on de jquery - mapea la fila
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

// metodo para borrar un producto
on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  console.log(id);

  alertify.confirm(
    "Se eliminara el usuario seleccionado. Desea continuar?",
    function () {
      borrarElemento(id)
      alertify.success("Operacion compaletada!");
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
});

//metodo para editar producto
let referenciaForm = 0;
on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;
  referenciaForm = fila.children[0].innerHTML;
  const nombreForm = fila.children[1].innerHTML;
  const categoriaForm = fila.children[2].innerHTML;
  const especialidadForm = fila.children[3].innerHTML;
  const descripcionForm = fila.children[4].innerHTML;
  const disponibilidadForm = fila.children[5].innerHTML;
  const precioForm = fila.children[6].innerHTML;
  const fechaForm = fila.children[7].innerHTML;
 
  editarReferencia.value = referenciaForm
  editarNombre.value = nombreForm
  editarCategoria.value = categoriaForm
  editarEspecialidad.value = especialidadForm
  editarDescripcion.value = descripcionForm
  editarDisponibilidad.value = disponibilidadForm
  editarPrecio.value = precioForm
  editarFecha.value = fechaForm
  opcion = "editar";
  modalEdit.show();
});

// boton crear nuevos productos  y limpiar campos
btnCrear.addEventListener("click", () => {
  referencia.value = "";
  nombre.value = "";
  categoria.value = "";
  especialidad.value = "";
  descripcion.value = "";
  disponibilidad.value = "";
  precio.value = "";
  fecha.value = "";
  modalProducto.show();
  opcion = "crear";
});

// validacion de cargue de pagina - solo permite rol ADM
if (usuarioAutenticado != null) {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  console.log(a);
  obtenerUsuario(a);
}

// peticion ajax que trae los usuarios
function getProductos() {
  $.ajax({
    url: "http://localhost:8085/api/product/all",
    type: "GET",
    dataType: "json",
    success: function (json) {
      mostrar(json);
    },
  });
}

// cerrar sesion del usuario
function cerrarSesion() {
  alertify.confirm(
    "Se terminara la sesion actual. Desea continuar?",
    function () {
      sessionStorage.removeItem("NOMBRE");
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
    url: "http://localhost:8085/api/product/" + id,
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
    let data={
        reference: d.getElementById("crearReferencia").value,
        name: d.getElementById("crearNombre").value,
        category: d.getElementById("crearCategoria").value,
        speciality: d.getElementById("crearEspecialidad").value,
        description: d.getElementById("crearDescripcion").value,
        availability: d.getElementById("crearDisponibilidad").value,
        price: d.getElementById("crearPrecio").value,
        date: d.getElementById("crearFecha").value,
    }
    let dataToSend = JSON.stringify(data);
    $.ajax({
        url: "http://localhost:8085/api/product/new",
        type:"POST",
        contentType: "application/json",
        data: dataToSend,
        success: function (){
            modalProducto.hide();
            alertify.success("Producto creado correctamante !!")
            retardar()
        }
    }); 
  });
}

//registrar un usuario
function editarProducto(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    let data={
        reference: referenciaForm,
        name: d.getElementById("editarNombre").value,
        category: d.getElementById("editarCategoria").value,
        speciality: d.getElementById("editarEspecialidad").value,
        description: d.getElementById("editarDescripcion").value,
        availability: d.getElementById("editarDisponibilidad").value,
        price: d.getElementById("editarPrecio").value,
        date: d.getElementById("editarFecha").value,
    }
       let dataToSend = JSON.stringify(data);
    $.ajax({
        url: "http://localhost:8085/api/product/update",
        type:"PUT",
        contentType: "application/json",
        data: dataToSend,
        success: function (){
            modalEdit.hide();
            alertify.success("Producto Actualizado correctamente !!")
            retardar()
        }
    }); 
  });
}
// funcion para retardar el cargado de la pagina
function retardar(){
    function retrasarCarga() {
        location.reload();
      }
      setTimeout(retrasarCarga, 2000);
}


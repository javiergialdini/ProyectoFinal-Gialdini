class Libro {
    constructor(id,titulo, genero, precio, stock, img){
        this.id = id;
        this.titulo = titulo
        this.genero = genero
        this.precio = precio
        this.stock = stock
        this.img = img
    }
}


let listaLibros;
let listaLibrosComprar = [];
let codigoDescuento;
let descuento = 1;

let totalesCarrito = 0;
let totalPrecioCompra = 0;
let listaGenerosLimpia = [];


listaLibrosComprarJson = localStorage.getItem("carritoLibros")
if(listaLibrosComprarJson != null) {
    listaLibrosComprar = JSON.parse(listaLibrosComprarJson);
    listaLibrosComprar.forEach(libro => {
        totalesCarrito += libro.stock;
        document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;
    })
}


// CARGO CAJAS DE LIBROS
const contenedorLibros = document.getElementById("div1")
const datosCC = document.getElementById("div2");


fetch("./jsonLibros.json")
    .then(respuesta => respuesta.json())
    .then( datos => {
        listaLibros = datos;
    })
    .catch( error => console.log(error))
    .finally( () => {
        mostrarLibros(listaLibros);
        obtenerGenero(listaLibros);
    })

function mostrarLibros(librosMostrar) {
    datosCC.replaceChildren();
    datosCC.setAttribute("hidden", true);
    contenedorLibros.replaceChildren();
    contenedorLibros.style = "width: 100%;";
    contenedorLibros.className = "album py-5 bg-light card";
    const contenedor = document.createElement("div");
    contenedor.className = "container";
    const row = document.createElement("div");
    row.className = "row";

    librosMostrar.forEach(libro => {
        const div = document.createElement("div");
        const disabled = libro.stock === 0 ? "disabled" : "";
        const pathIMG = libro.img != '' ? ("./img/" + libro.img) : "holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail";
        div.className = "col-md-3";
        div.innerHTML = `<div class="card mb-4 box-shadow">
                            <img class="card-img-top" alt="Thumbnail [100%x225]" style="height: 225px; width: 75%; display: block; margin: auto;" src="${pathIMG}" data-holder-rendered="true">
                            <div class="card-body">
                                <p class="card-text" style="width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${libro.titulo}</p>
                                <p class="text-muted" style="font-size: 16px; width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">$ ${libro.precio}</small>
                                <p class="text-muted" style="font-size: 12px; width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${libro.genero}</small>
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary" value="${libro.id}" onClick="añadeACarro(${libro.id})" ${disabled}>Añadir</button>
                                </div>
                                </div>
                            </div>
                        </div>`
        row.appendChild(div);
    })
    contenedor.appendChild(row);
    contenedorLibros.appendChild(contenedor);

    const btnCarro = document.getElementById("btnCarro");
    btnCarro.innerHTML = "VER CARRO";
}





//    **********   CARRITO   ******

// AGREGO EVENTO AL BOTON CARRO
const btnCarro = document.getElementById("btnCarro");
btnCarro.onclick = () => {
    const checkFiltro = document.getElementById("divCheckDispo")
    if(btnCarro.innerHTML === "VER CARRO"){
        checkFiltro.replaceChildren();
        mostrarCarrito(listaLibrosComprar);
    }
    else {
        checkFiltro.innerHTML = '<p>Mostar solo disponibles <input type="checkbox" id="soloStock"/></p>'
        checkFiltro.onclick = () => {
            libros = filtrado(filtro, (document.getElementById("soloStock").checked ? 1:0));
            mostrarLibros(libros)
        }
        cargarBotonesFiltro(listaGenerosLimpia);
        mostrarLibros(listaLibros);
    }
}

// CARGO LISTA DE CARRITO CON LIBROS AGREGADOS
function mostrarCarrito(listaLibrosComprar) {
    datosCC.replaceChildren();
    datosCC.removeAttribute("hidden")
    contenedorFiltros.replaceChildren();
    contenedorLibros.replaceChildren();
    if(listaLibrosComprar == "") {
        const div = document.createElement("div");
        div.className = "carrito";
        div.innerHTML = `<h2 class="margenIzq"> Aún no agregó ningún libro al carro </h2>`;
        contenedorLibros.appendChild(div);
        datosCC.setAttribute("hidden", true);
    }
    else
    {
        totalPrecioCompra=0;
        contenedorLibros.style = "float:left; width: 50%; position: relative;";
        listaLibrosComprar.forEach(libro => {
        const disabledBtnMenos = libro.stock === 0 ? "disabled" : "";
        listaLibros.find(libro => libro.id === libro.id).stock === 0;
        const disabledBtnMas = listaLibros.find(libroLista => libroLista.id === libro.id).stock === 0 ? "disabled": "";
        totalPrecioCompra += libro.precio*libro.stock;

        const div = document.createElement("div");
        div.className = "carrito";
        const pathIMG = libro.img != '' ? ("./img/" + libro.img) : "holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail";
        div.innerHTML = `<table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="padding-left: 10px; width: 1%;">
                                        <img class="card-img-top" alt="Thumbnail [100%x225]" style="height: 60px; width: 36px; margin-right: 10px;" src="${pathIMG}" data-holder-rendered="true">
                                    </td>
                                    <td style="padding-left: 10px; width: 40%; text-align:left;">
                                        ${libro.titulo}<br><p style="font-size: 14px;">$${libro.precio}</p>
                                    </td>
                                    <td style="padding-left: 10px; width: 1%;">
                                        <input class="btn btn-sm btn-outline-secondary" id="btnMenos" type="submit" value="-" style=" width: 35px;" onClick=quitarElemento(${libro.id}) ${disabledBtnMenos}>
                                    </td>
                                    <td style="padding-left: 2px; width: 1%;">
                                        <input type="nummber" value="${libro.stock}" style=" width: 35px; text-align: center;" disabled>
                                    </td>
                                    <td style="padding-left: 2px; width: 1%;">
                                        <input class="btn btn-sm btn-outline-secondary" id="btnMas" type="submit" value="+" style=" width: 35px;" onClick="agregarElemento(${libro.id})" ${disabledBtnMas}>
                                    </td>
                                    <td style="padding-left: 10px; width: 10%;">
                                        <input class="btn btn-sm btn-outline-secondary" type="submit" value="Quitar" onClick="confirmarEliminar(${libro.id})">
                                    </td>
                                    <td style="padding-left: 10px; width: 10%;">
                                        $${libro.precio*libro.stock}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr>`;
        contenedorLibros.appendChild(div);
        })

        const divUltimo = document.createElement("div");
        divUltimo.className = "carrito";
        divUltimo.style = "height: 20px;";
        divUltimo.innerHTML = `<table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="padding-right: 20px; width: 50%; text-align:right;">
                                        <br><p style="font-size: 14px;">Total $${totalPrecioCompra}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`;
        contenedorLibros.appendChild(divUltimo);

        datosCC.style="width: 45%; height: 100%; float:left; position: relative; padding-left: 20px; margin-left: 5%; padding-right: 20px;";
        const divCC = document.createElement("div");
        divCC.className = "creditCard";
        divCC.innerHTML = `<div class="form-label" style="margin-top: 10px;"> DATOS TARJETA DE CRÉDITO </div>
                            <form class="row g-3" style="margin-bottom: 10px;" onsubmit="return confirmarCompra()">
                                <div class="col-md-6">
                                    <label for="validationDefault01" class="form-label">Número de tarjeta</label>
                                    <input type="text" class="form-control" id="numCC" onkeyup="FromatNumeroCC()" maxlength="19" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="validationDefault02" class="form-label">Nombre y apellido</label>
                                    <input type="text" class="form-control" id="nomApe"  required>
                                </div>
                                <div class="col-md-3">
                                    <label for="validationDefault03" class="form-label">Fecha de expiración</label>
                                    <input type="text" class="form-control" id="expy" onkeyup="FromatExpy()" maxlength="5" required>
                                </div>
                                <div class="col-md-3">
                                    <label for="validationDefault03" class="form-label">Cod de seguridad</label>
                                    <input type="text" class="form-control" id="codSeg" onkeyup="FromatCodSeg()" maxlength="3" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="validationDefault05" class="form-label">DNI</label>
                                    <input type="text" class="form-control" id="docDNI" onkeyup="FromatNumeroDNI()"  required>
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-sm btn-outline-secondary" id="btnCompra">COMPRAR</button>
                                </div>
                            </form>
                            `;
        datosCC.appendChild(divCC);
    }

    const btnCarro = document.getElementById("btnCarro");
    btnCarro.innerHTML = "VOLVER";
}

function FromatExpy(){
    let expy = document.getElementById("expy").value;
    if(expy.length < 3){
    document.getElementById("expy").value = expy.replace(/\s/g, '')
                                                    .replace(/\D/g, '')
                                                    .replace(/([0-9]{2})/g, '$1/');
    }
}

function FromatCodSeg(){
    let codSeg = document.getElementById("codSeg").value;
    document.getElementById("codSeg").value = codSeg.replace(/\s/g, '')
                                                    .replace(/\D/g, '');
}

function FromatNumeroCC(){
    let numcc = document.getElementById("numCC").value;
    document.getElementById("numCC").value = numcc.replace(/\s/g, '')
                                                    .replace(/\D/g, '')
                                                    .replace(/([0-9]{4})/g, '$1 ').trim();
}

function FromatNumeroDNI(){
    let docDNI = document.getElementById("docDNI").value;
    document.getElementById("docDNI").value = docDNI.replace(/\s/g, '')
                                                    .replace(/\D/g, '');
}

// AÑADO LIBRO AL CARRO
function añadeACarro(id){
    const stock = listaLibros.find(libro => libro.id === id).stock;
    if(stock > 0){
        listaLibros.find(libro => libro.id === id).stock --;
        const libroLista = listaLibrosComprar.find(libro => libro.id === id);

        if(listaLibrosComprar.find(libro => libro.id === id) === undefined){
            const libroAux = listaLibros.find(libro => libro.id === id);
            const libroAdd = new Libro(libroAux.id, libroAux.titulo, libroAux.genero, libroAux.precio, 1, libroAux.img); 
            listaLibrosComprar.push(libroAdd);
        } else {
            listaLibrosComprar.find(libro => libro.id === id).stock ++;
        }

        const librosStorage = JSON.stringify(listaLibrosComprar);
        localStorage.setItem("carritoLibros", librosStorage);

        totalesCarrito++;
        Toastify({
            text: "Se añade al carro",
            gravity: "bottom",
            position: "right",
            style:{
                background: "#999999"
            }
        }).showToast();
        document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;
        mostrarLibros(listaLibros);
    }
}

function confirmarEliminar(id) {
    const libroBorrar = listaLibrosComprar.find(libro => libro.id === id);
    Swal.fire({
        title: `¿Está seguro que desea eliminar "${libroBorrar.titulo}" del carrito?`,
        text: `Cantidad del mismo en el carrito: ${libroBorrar.stock}`,
        icon: "warning",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        calcelButtonText: "Cancelar"
    }).then((result) => {
        if(result.isConfirmed) {
            quitarLista(id)
        }
    })
}

function confirmarCompra(){
    event.preventDefault();
    Swal.fire({
        title: `¿Desea confirmar compra?`,
        icon: "info",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if(result.isConfirmed) {
            localStorage.clear();
            listaLibrosComprar = [];
            Swal.fire({
                title: `COMPRA REALIZADA`,
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then((result) => {
                    totalesCarrito = 0;
                    document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;
                    totalPrecioCompra = 0;
                    mostrarLibros(listaLibros);
            })
        }
        else return false;
    })
}


// QUITO LISTA DEL CARRO
function quitarLista(id){
    const index = listaLibrosComprar.map( libro => libro.id).indexOf(id);
    const stockLibroCarrito = listaLibrosComprar.find(libro => libro.id === id).stock;
    listaLibros.find(libro => libro.id === id).stock += stockLibroCarrito;
    totalesCarrito -= stockLibroCarrito;
    listaLibrosComprar.splice(index, 1);
    document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;

    const librosStorage = JSON.stringify(listaLibrosComprar);
    localStorage.setItem("carritoLibros", librosStorage);

    mostrarCarrito(listaLibrosComprar);
}

// QUITO ELEMENTO DEL CARRO
function quitarElemento(id){
    listaLibros.find(libro => libro.id === id).stock ++;
    listaLibrosComprar.find(libro => libro.id === id).stock --;
    totalesCarrito --;
    document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;

    const librosStorage = JSON.stringify(listaLibrosComprar);
    localStorage.setItem("carritoLibros", librosStorage);

    mostrarCarrito(listaLibrosComprar);
}

// AGREGO ELEMENTO AL CARRO
function agregarElemento(id){
    listaLibros.find(libro => libro.id === id).stock --;
    listaLibrosComprar.find(libro => libro.id === id).stock ++;
    totalesCarrito ++;
    document.getElementById("cantItems").innerHTML = `Items en el carro: ${totalesCarrito}`;

    const librosStorage = JSON.stringify(listaLibrosComprar);
    localStorage.setItem("carritoLibros", librosStorage);

    mostrarCarrito(listaLibrosComprar);
}

//   **********  CARGO BOTONES DE FILTRO      *********
const contenedorFiltros = document.getElementById("btnsFiltro")
function obtenerGenero(libros) {
    const listaGeneros = [];
    libros.forEach(libro => {
        if(libro.genero.includes("/")){
            const subGeneros = libro.genero.split("/");
            subGeneros.forEach( gen => {
                listaGeneros.push(gen);
            })
        } else {
            listaGeneros.push(libro.genero);
        }
    })

    listaGenerosLimpia = [...new Set(listaGeneros)];
    cargarBotonesFiltro(listaGenerosLimpia);
}

function cargarBotonesFiltro(listaFiltros) {
    const button = document.createElement("button");
    button.className = "btn btn-sm btn-outline-secondary";
    button.id = "todos";
    button.innerHTML = "Todos";
    button.addEventListener("click", aplicarFiltro.bind(null, "todos"));
    contenedorFiltros.appendChild(button);
    listaGenerosLimpia.forEach( genero => {
        const button = document.createElement("button");
        button.className = "btn btn-sm btn-outline-secondary m-1";
        button.id = genero;
        button.innerHTML = genero;
        button.addEventListener("click", aplicarFiltro.bind(null, genero));
        contenedorFiltros.appendChild(button);
    })
}

// AGREGO EVENTO A BOTONES DE FILTRO CATEGORIAS
let filtro = "todos";

function aplicarFiltro(genero) {
    filtro = genero;
    libros = filtrado(genero, (document.getElementById("soloStock").checked ? 1:0));
    mostrarLibros(libros);
}

// AGREGO EVENTO EL CHECKBOX DE STOCK
const checkStock = document.getElementById("soloStock");
checkStock.onclick = () => {
    libros = filtrado(filtro, (document.getElementById("soloStock").checked ? 1:0));
    mostrarLibros(libros)
}

// Aplico filtro por género y si verifica stock
function filtrado(genero, hayStock) {
    let librosFiltrados
    if(genero === "todos"){
        librosFiltrados = listaLibros.filter(libro => libro.stock >= hayStock);
        return librosFiltrados;
    }
    else{
        librosFiltrados = listaLibros.filter(libro => libro.genero.includes(genero) && libro.stock >= hayStock);
        return librosFiltrados;
    }
}

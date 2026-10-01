let productos = [];

const VERSION_PRODUCTOS = "v7";


function crearProductosIniciales() {

    if (
        typeof productosIniciales === "undefined" ||
        !Array.isArray(productosIniciales)
    ) {

        console.error("ERROR: productos.js no está cargado correctamente.");

        const tabla =
            document.getElementById("tablaProductos");

        if (tabla) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="7" style="color:red; padding:30px; text-align:center;">
                        ERROR: No se pudo cargar productos.js
                    </td>
                </tr>
            `;

        }

        return [];

    }


    return productosIniciales.map(
        (producto, index) => {

            return {

                id: index + 1,

                codigo:
                    String(producto.codigo || ""),

                codigoBarras:
                    String(producto.codigoBarras || ""),

                descripcion:
                    String(producto.descripcion || ""),

                estadoPedido:
                    "Pendiente",

                cantidadPedido:
                    0,

                estadoBodega:
                    "Pendiente",

                cantidadBodega:
                    0,

                estadoRecepcion:
                    "No llegó",

                cantidadRecibida:
                    0

            };

        }
    );

}


function iniciarProductos() {

    let productosGuardados = null;


    try {

        productosGuardados =
            JSON.parse(
                localStorage.getItem("productos")
            );

    } catch (error) {

        productosGuardados = null;

    }


    const versionGuardada =
        localStorage.getItem(
            "versionProductos"
        );


    if (
        versionGuardada !== VERSION_PRODUCTOS ||
        !Array.isArray(productosGuardados) ||
        productosGuardados.length === 0
    ) {

        productos =
            crearProductosIniciales();


        if (productos.length === 0) {
            return;
        }


        guardarProductos();


        localStorage.setItem(
            "versionProductos",
            VERSION_PRODUCTOS
        );

    } else {

        productos =
            productosGuardados;


        productos.forEach(
            producto => {

                if (
                    typeof producto.cantidadPedido !== "number"
                ) {
                    producto.cantidadPedido = 0;
                }


                if (
                    typeof producto.cantidadBodega !== "number"
                ) {
                    producto.cantidadBodega = 0;
                }


                if (
                    typeof producto.cantidadRecibida !== "number"
                ) {
                    producto.cantidadRecibida = 0;
                }


                if (!producto.estadoPedido) {
                    producto.estadoPedido = "Pendiente";
                }


                if (!producto.estadoBodega) {
                    producto.estadoBodega = "Pendiente";
                }


                if (!producto.estadoRecepcion) {
                    producto.estadoRecepcion = "No llegó";
                }

            }
        );


        guardarProductos();

    }


    mostrarProductos();

}


function guardarProductos() {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

}


function mostrarProductos() {

    const tabla =
        document.getElementById(
            "tablaProductos"
        );


    const buscador =
        document.getElementById(
            "buscador"
        );


    if (!tabla || !buscador) {
        return;
    }


    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    tabla.innerHTML = "";


    let encontrados = 0;


    productos.forEach(
        (producto, index) => {

            const codigo =
                String(
                    producto.codigo || ""
                );


            const codigoBarras =
                String(
                    producto.codigoBarras || ""
                );


            const descripcion =
                String(
                    producto.descripcion || ""
                );


            const contenido =
                (
                    codigo +
                    " " +
                    codigoBarras +
                    " " +
                    descripcion
                ).toLowerCase();


            if (
                texto !== "" &&
                !contenido.includes(texto)
            ) {

                return;

            }


            encontrados++;


            const fila =
                document.createElement("tr");


            let clasePedido =
                "estado-actual estado-Pendiente";


            if (
                producto.estadoPedido === "Quiero"
            ) {

                clasePedido =
                    "estado-actual estado-Quiero";

            }


            if (
                producto.estadoPedido === "No quiero"
            ) {

                clasePedido =
                    "estado-actual estado-NoQuiero";

            }


            let claseBodega =
                "estado-actual estado-PendienteBodega";


            if (
                producto.estadoBodega === "Mandado"
            ) {

                claseBodega =
                    "estado-actual estado-Mandado";

            }


            let claseRecepcion =
                "estado-actual estado-NoLlego";


            if (
                producto.estadoRecepcion === "Llegó"
            ) {

                claseRecepcion =
                    "estado-actual estado-Llego";

            }


            fila.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escaparHTML(codigo)}
                </td>

                <td>
                    ${escaparHTML(codigoBarras)}
                </td>

                <td>
                    ${escaparHTML(descripcion)}
                </td>


                <td>

                    <span class="seccion-titulo">
                        
                    </span>


                    <div class="botones-estado">

                        <button
                            class="btn-estado btn-quiero"
                            onclick="cambiarEstadoPedido(${producto.id}, 'Quiero')"
                            type="button"
                        >
                            QUIERO
                        </button>


                        <button
                            class="btn-estado btn-no-quiero"
                            onclick="cambiarEstadoPedido(${producto.id}, 'No quiero')"
                            type="button"
                        >
                            NO QUIERO
                        </button>

                    </div>


                    <span class="${clasePedido}">
                        ${escaparHTML(
                            producto.estadoPedido
                        )}
                    </span>


                    <span class="cantidad-titulo">
                        Cantidad de paquetes:
                    </span>


                    <div class="control-cantidad">

                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'pedido', -1)"
                            type="button"
                        >
                            −
                        </button>


                        <span class="numero-cantidad">
                            ${producto.cantidadPedido}
                        </span>


                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'pedido', 1)"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </td>


                <td>

                    <span class="seccion-titulo">
                        
                    </span>


                    <div class="botones-estado">

                        <button
                            class="btn-estado btn-mandado"
                            onclick="cambiarEstadoBodega(${producto.id}, 'Mandado')"
                            type="button"
                        >
                            MANDADO
                        </button>


                        <button
                            class="btn-estado btn-pendiente-bodega"
                            onclick="cambiarEstadoBodega(${producto.id}, 'Pendiente')"
                            type="button"
                        >
                            PENDIENTE
                        </button>

                    </div>


                    <span class="${claseBodega}">
                        ${escaparHTML(
                            producto.estadoBodega
                        )}
                    </span>


                    <span class="cantidad-titulo">
                        Cantidad de paquetes:
                    </span>


                    <div class="control-cantidad">

                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'bodega', -1)"
                            type="button"
                        >
                            −
                        </button>


                        <span class="numero-cantidad">
                            ${producto.cantidadBodega}
                        </span>


                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'bodega', 1)"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </td>


                <td>

                    <span class="seccion-titulo">
                    
                    </span>


                    <div class="botones-estado">

                        <button
                            class="btn-estado btn-llego"
                            onclick="cambiarEstadoRecepcion(${producto.id}, 'Llegó')"
                            type="button"
                        >
                            LLEGÓ
                        </button>


                        <button
                            class="btn-estado btn-no-llego"
                            onclick="cambiarEstadoRecepcion(${producto.id}, 'No llegó')"
                            type="button"
                        >
                            NO LLEGÓ
                        </button>

                    </div>


                    <span class="${claseRecepcion}">
                        ${escaparHTML(
                            producto.estadoRecepcion
                        )}
                    </span>


                    <span class="cantidad-titulo">
                        Cantidad de paquetes:
                    </span>


                    <div class="control-cantidad">

                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'recibida', -1)"
                            type="button"
                        >
                            −
                        </button>


                        <span class="numero-cantidad">
                            ${producto.cantidadRecibida}
                        </span>


                        <button
                            class="btn-cantidad"
                            onclick="cambiarCantidad(${producto.id}, 'recibida', 1)"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </td>

            `;


            tabla.appendChild(fila);

        }
    );


    const mensaje =
        document.getElementById(
            "sinResultados"
        );


    if (mensaje) {

        mensaje.style.display =
            encontrados === 0
                ? "block"
                : "none";

    }


    actualizarResumen();

}


function escaparHTML(texto) {

    return String(texto)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function cambiarCantidad(
    id,
    tipo,
    cambio
) {

    const producto =
        productos.find(
            p => p.id === id
        );


    if (!producto) {
        return;
    }


    if (tipo === "pedido") {

        producto.cantidadPedido =
            Math.max(
                0,
                (Number(
                    producto.cantidadPedido
                ) || 0) + cambio
            );

    }


    if (tipo === "bodega") {

        producto.cantidadBodega =
            Math.max(
                0,
                (Number(
                    producto.cantidadBodega
                ) || 0) + cambio
            );

    }


    if (tipo === "recibida") {

        producto.cantidadRecibida =
            Math.max(
                0,
                (Number(
                    producto.cantidadRecibida
                ) || 0) + cambio
            );

    }


    guardarProductos();

    mostrarProductos();

}


function cambiarEstadoPedido(
    id,
    estado
) {

    const producto =
        productos.find(
            p => p.id === id
        );


    if (!producto) {
        return;
    }


    producto.estadoPedido =
        estado;


    if (
        estado === "No quiero"
    ) {

        producto.cantidadPedido = 0;

    }


    guardarProductos();

    mostrarProductos();

}


function cambiarEstadoBodega(
    id,
    estado
) {

    const producto =
        productos.find(
            p => p.id === id
        );


    if (!producto) {
        return;
    }


    producto.estadoBodega =
        estado;


    guardarProductos();

    mostrarProductos();

}


function cambiarEstadoRecepcion(
    id,
    estado
) {

    const producto =
        productos.find(
            p => p.id === id
        );


    if (!producto) {
        return;
    }


    producto.estadoRecepcion =
        estado;


    if (
        estado === "No llegó"
    ) {

        producto.cantidadRecibida = 0;

    }


    guardarProductos();

    mostrarProductos();

}


function actualizarResumen() {

    const total =
        productos.length;


    const quiero =
        productos.filter(
            p =>
                p.estadoPedido ===
                "Quiero"
        ).length;


    const noQuiero =
        productos.filter(
            p =>
                p.estadoPedido ===
                "No quiero"
        ).length;


    const pendiente =
        productos.filter(
            p =>
                !p.estadoPedido ||
                p.estadoPedido ===
                "Pendiente"
        ).length;


    const elementoTotal =
        document.getElementById(
            "totalProductos"
        );


    const elementoQuiero =
        document.getElementById(
            "totalQuiero"
        );


    const elementoNoQuiero =
        document.getElementById(
            "totalNoQuiero"
        );


    const elementoPendiente =
        document.getElementById(
            "totalPendiente"
        );


    if (elementoTotal) {
        elementoTotal.textContent = total;
    }


    if (elementoQuiero) {
        elementoQuiero.textContent = quiero;
    }


    if (elementoNoQuiero) {
        elementoNoQuiero.textContent = noQuiero;
    }


    if (elementoPendiente) {
        elementoPendiente.textContent = pendiente;
    }

}


function exportarExcel() {

    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "No se pudo cargar Excel. Revisa tu conexión a Internet."
        );

        return;
    }


    const datos =
        productos.map(
            producto => {

                return {

                    "CÓDIGO":
                        producto.codigo,

                    "Código de Barras":
                        producto.codigoBarras,

                    "DESCRIPCIÓN":
                        producto.descripcion,

                    "PEDIDO":
                        producto.estadoPedido,

                    "PAQUETES":
                        producto.cantidadPedido,

                    "ESTADO":
                        producto.estadoBodega,

                    "CAN-BODEGA":
                        producto.cantidadBodega,

                    "RECIBIDO":
                        producto.estadoRecepcion,

                    "CAN-RECIBIDA":
                        producto.cantidadRecibida

                };

            }
        );


    const hoja =
        XLSX.utils.json_to_sheet(
            datos
        );


    const libro =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Productos"
    );


    XLSX.writeFile(
        libro,
        "control_productos.xlsx"
    );

}


function cargarProductosIniciales() {

    const confirmar =
        confirm(
            "Esto reemplazará la lista actual y borrará las respuestas actuales. ¿Deseas continuar?"
        );


    if (!confirmar) {
        return;
    }


    productos =
        crearProductosIniciales();


    if (productos.length === 0) {
        return;
    }


    guardarProductos();


    localStorage.setItem(
        "versionProductos",
        VERSION_PRODUCTOS
    );


    mostrarProductos();

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const buscador =
            document.getElementById(
                "buscador"
            );


        if (buscador) {

            buscador.addEventListener(
                "input",
                mostrarProductos
            );

        }


        iniciarProductos();

    }
); 

function enviarPedido() {

    const URL_GOOGLE_SHEETS =
        "https://script.google.com/macros/s/AKfycbxzulS12aoDo1DK-0dAGemfgjeyfhppnY-GP9hctJD4I8voG77p20dhxTfRle4Yj5Ek/exec";


    const seleccionados =
        productos.filter(producto => {

            return (
                producto.estadoPedido === "Quiero" &&
                Number(producto.cantidadPedido) > 0
            );

        });


    if (seleccionados.length === 0) {

        alert(
            "No has seleccionado ningún producto."
        );

        return;

    }


    const confirmar =
        confirm(
            "¿Deseas enviar los productos seleccionados?"
        );


    if (!confirmar) {
        return;
    }


    const datos = {

        productos:
            seleccionados.map(producto => {

                return {

                    codigo:
                        producto.codigo,

                    codigoBarras:
                        producto.codigoBarras,

                    descripcion:
                        producto.descripcion,

                    estadoPedido:
                        producto.estadoPedido,

                    cantidadPedido:
                        Number(
                            producto.cantidadPedido
                        ),

                    estadoBodega:
                        producto.estadoBodega,

                    cantidadBodega:
                        Number(
                            producto.cantidadBodega
                        ),

                    estadoRecepcion:
                        producto.estadoRecepcion,

                    cantidadRecibida:
                        Number(
                            producto.cantidadRecibida
                        )

                };

            })

    };


    fetch(
       function enviarPedido() {

    const campoTienda =
        document.getElementById("nombreTienda");

    const nombreTienda =
        campoTienda
            ? campoTienda.value.trim()
            : "";


    // Verificar nombre de tienda

    if (!nombreTienda) {

        alert(
            "Debe ingresar el nombre de la tienda antes de enviar el pedido."
        );

        if (campoTienda) {
            campoTienda.focus();
        }

        return;
    }


    // Obtener únicamente productos seleccionados

    const seleccionados =
        productos.filter(producto => {

            return (
                producto.estadoPedido === "Quiero" &&
                Number(producto.cantidadPedido) > 0
            );

        });


    if (seleccionados.length === 0) {

        alert(
            "No has seleccionado ningún producto."
        );

        return;
    }


    // Confirmación

    const confirmar =
        confirm(
            "¿Deseas enviar el pedido a Excel?"
        );


    if (!confirmar) {
        return;
    }


    // Verificar Excel

    if (typeof XLSX === "undefined") {

        alert(
            "No se pudo cargar Excel. Revisa tu conexión a Internet."
        );

        return;
    }


    // Preparar información

    const datos =
        seleccionados.map(producto => {

            return {

                "TIENDA":
                    nombreTienda,

                "CÓDIGO":
                    producto.codigo,

                "CÓDIGO DE BARRAS":
                    producto.codigoBarras,

                "DESCRIPCIÓN":
                    producto.descripcion,

                "PEDIDO":
                    producto.estadoPedido,

                "PAQUETES":
                    Number(producto.cantidadPedido),

                "ESTADO BODEGA":
                    producto.estadoBodega,

                "CAN-BODEGA":
                    Number(producto.cantidadBodega),

                "RECIBIDO":
                    producto.estadoRecepcion,

                "CAN-RECIBIDA":
                    Number(producto.cantidadRecibida)

            };

        });


    // Crear Excel

    const hoja =
        XLSX.utils.json_to_sheet(datos);


    const libro =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "PEDIDO"
    );


    // Nombre del archivo

    const nombreArchivo =
        "PEDIDO_" +
        nombreTienda
            .replace(/[\\/:*?"<>|]/g, "")
            .replace(/\s+/g, "_") +
        ".xlsx";


    // Descargar Excel

    XLSX.writeFile(
        libro,
        nombreArchivo
    );


    alert(
        "✅ PEDIDO ENVIADO A EXCEL CORRECTAMENTE"
    );


    // Limpiar nombre de tienda

    if (campoTienda) {
        campoTienda.value = "";
    }

}
const socketClient = io();

//enviar producto a traves de sockets
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    //enviar el producto por medio de socket
    socketClient.emit("newProduct", product);
});

const productsContainer = document.getElementById("productsContainer");
//recibir productos y mostrarlos en una tabla.
socketClient.on("productsArray", async (data) => {
    console.log(data)
    const templateTable = await fetch("./templates/table.handlebars");
    //convertimos a formato del template
    const templateFormat = await templateTable.text();
    // console.log(template)
    const template = Handlebars.compile(templateFormat);
    //generamos el html con el template y con los datos de los productos
    const html = template({ products: data });
    productsContainer.innerHTML = html;
})

const chatForm = document.getElementById("chatForm")

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();//prevenimos que se relanze el alert incial
    console.log("formulario enviado");
    const mensaje = {
        author: user,
        text: document.getElementById("msgChat").value
    }
    console.log(mensaje);
    //enviamos nuevo mensaje
    socketClient.emit("newMsg", mensaje)
})

//para el chat
const chatContainer = document.getElementById("chatContainer")


socketClient.on("msgChat", (data) => {
    console.log(data);
    let messages = ""
    data.forEach(element => {
        messages += `<p><span style="color:blue;font-weight: bold">Autor: ${element.author}</span> <span style="color:brown;font-style:italic">${Date()}</span> <span style="color:green;font-style:italic">mensaje: ${element.text}</span></p>`
    });

    chatContainer.innerHTML = messages
})
//capturamos el nombre del ususario que se conecta al chat
let user = ""
Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu Correo de usuario",
    input: "text",
    allowOutsideClick: false
}).then(response => {
    user = response.value;
    console.log(user);
    document.getElementById("userName").innerHTML = `Hola ${user}!`
})

//enviamos el mensaje del form al servidor

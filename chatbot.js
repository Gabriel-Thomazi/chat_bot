// leitor de qr code
const qrcode = require("qrcode-terminal");
const { Client, Buttons, List, MessageMedia } = require("whatsapp-web.js"); // Mudança Buttons
const client = new Client();
// serviço de leitura do qr code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
// apos isso ele diz que foi tudo certo
client.on("ready", () => {
  console.log("Tudo certo! WhatsApp conectado.");
});
// E inicializa tudo
client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

client.on("message", async (msg) => {
  if (
    msg.body.match(/(Menu|menu|dia|tarde|noite|oi|Oi|Ola|Olá|ola|Oie|oie)/i) &&
    msg.from.endsWith("@c.us")
  ) {
    const chat = await msg.getChat();

    await delay(3000); //delay de 3 segundos

    await chat.sendStateTyping(); // Simulando Digitação
    await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
    const contact = await msg.getContact(); //Pegando o contato
    const name = contact.pushname; //Pegando o nome do contato
    await client.sendMessage(
      msg.from,
      "Olá! " +
        name.split(" ")[0] +
        ", que bom que você tem interesse em se hospedar no Recanto das Flores! 🌿✨ Para qual data você gostaria de verificar a disponibilidade? Nossas acomodações incluem café da manhã e uma experiência incrível. Me avise a data e quantas pessoas serão para que eu possa te passar as opções! 😊"
    ); //Primeira mensagem de texto
  }
});

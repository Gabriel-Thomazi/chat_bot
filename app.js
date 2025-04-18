// Requerendo as dependências
const qrcode = require("qrcode-terminal");
const { Client, Buttons, List, MessageMedia } = require("whatsapp-web.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Usar a porta configurada pelo Railway ou 3000 localmente

const client = new Client();

// Serviço de leitura do QR code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true }); // Exibe o QR code no terminal
});

// Após o login, quando o WhatsApp estiver conectado
client.on("ready", () => {
  console.log("Tudo certo! WhatsApp conectado.");
});

// Iniciar a conexão do WhatsApp
client.initialize();

// Função de delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Função para responder a mensagens
client.on("message", async (msg) => {
  if (
    msg.body.match(/(Menu|menu|dia|tarde|noite|oi|Oi|Ola|Olá|ola|Oie|oie)/i) &&
    msg.from.endsWith("@c.us")
  ) {
    const chat = await msg.getChat();

    await delay(3000); // Delay de 3 segundos

    await chat.sendStateTyping(); // Simulando digitação
    await delay(3000); // Mais 3 segundos
    const contact = await msg.getContact(); // Pegando o contato
    const name = contact.pushname; // Pegando o nome do contato
    await client.sendMessage(
      msg.from,
      "Olá! " +
        name.split(" ")[0] +
        ", que bom que você tem interesse em se hospedar no Recanto das Flores! 🌿✨ Para qual data você gostaria de verificar a disponibilidade? Nossas acomodações incluem café da manhã e uma experiência incrível. Me avise a data e quantas pessoas serão para que eu possa te passar as opções! 😊"
    ); // Primeira mensagem de texto
  }
});

// Rota principal que agora retorna a mensagem de confirmação
app.get("/", (req, res) => {
  res.send(
    "ChatBot WhatsApp rodando! Escaneie o QR Code no terminal para começar a interagir."
  );
});

// Rota 404
app.use((req, res) => {
  res.status(404).send("Página não encontrada!");
});

// Iniciar o servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});

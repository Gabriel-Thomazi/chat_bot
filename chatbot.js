const express = require("express");
const qrcode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

// Iniciar o servidor Express
const app = express();

// Configuração do cliente WhatsApp com Puppeteer
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Argumentos necessários para o Railway
  },
});

// Gerar o QR Code e salvar como imagem
client.on("qr", async (qr) => {
  try {
    // Gera e salva o QR Code como imagem no diretório public
    await qrcode.toFile("./public/qrcode.png", qr);
    console.log("QR Code gerado e salvo!");
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
  }
});

// Após isso ele diz que foi tudo certo
client.on("ready", () => {
  console.log("Tudo certo! WhatsApp conectado.");
});

// Inicializa o cliente WhatsApp
client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Função para delay

// Funil para interação com o usuário
client.on("message", async (msg) => {
  if (msg.body.match(/(Menu|menu|oi|Olá)/i) && msg.from.endsWith("@c.us")) {
    const chat = await msg.getChat();

    await delay(3000);

    await chat.sendStateTyping(); // Simulando digitação
    await delay(3000);

    const contact = await msg.getContact();
    const name = contact.pushname;

    await client.sendMessage(
      msg.from,
      `Olá, ${
        name.split(" ")[0]
      }! Para conectar ao WhatsApp, por favor, escaneie o QR Code em: http://<SEU_DOMÍNIO>/qrcode.png`
    );
  }
});

// Servir o QR Code como um arquivo estático
app.use(express.static("public")); // Serve arquivos da pasta 'public'

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

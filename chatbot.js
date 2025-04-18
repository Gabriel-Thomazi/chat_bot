const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require("whatsapp-web.js");
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();

// Configuração do cliente WhatsApp com Puppeteer
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']  // Argumentos necessários para o Railway
  }
});

// Servir o QR Code via HTTP
client.on("qr", async (qr) => {
  try {
    // Gera o QR Code em formato de imagem
    await qrcode.toFile('./public/qrcode.png', qr);
    console.log("QR Code gerado e salvo como imagem!");
  } catch (err) {
    console.error("Erro ao gerar o QR Code:", err);
  }
});

// Após isso ele diz que foi tudo certo
client.on("ready", () => {
  console.log("Tudo certo! WhatsApp conectado.");
});

// Inicializa o cliente
client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Função para criar delay

// Funil para interação com o usuário
client.on("message", async (msg) => {
  if (
    msg.body.match(/(Menu|menu|dia|tarde|noite|oi|Oi|Ola|Olá|ola|Oie|oie)/i) &&
    msg.from.endsWith("@c.us")
  ) {
    const chat = await msg.getChat();

    await delay(3000); // Delay de 3 segundos

    await chat.sendStateTyping(); // Simulando digitação
    await delay(3000); // Delay de 3 segundos

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

// Servindo o QR Code via Express (em uma rota HTTP)
app.use(express.static('public')); // Serve os arquivos estáticos da pasta 'public'

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

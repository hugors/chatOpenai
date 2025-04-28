const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { gerarResposta, extrairDadosConsulta } = require('./openai');
const { agendarConsulta } = require('./calendar');
require('dotenv').config();
const axios = require('axios'); // se estiver usando validação da API

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Se você adicionou a validação da API OpenAI
async function validarAPIKeyOpenAI() {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    if (response.status === 200) {
      console.log('✅ API Key do OpenAI é válida.');
      return true;
    }
  } catch (error) {
    console.error('❌ Erro ao validar API Key:', error.response?.data || error.message);
    return false;
  }
}

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  const valida = await validarAPIKeyOpenAI();
  if (valida) {
    console.log('🤖 Bot pronto!');
  } else {
    console.log('❌ API OpenAI inválida, encerrando o bot.');
    process.exit(1);
  }
});

// Continua seu client.on('message') normalmente
client.on('message', async (msg) => {
  // ... seu código aqui
});

client.initialize();

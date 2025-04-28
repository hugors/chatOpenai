const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { gerarResposta, extrairDadosConsulta } = require('./openai');
const { agendarConsulta } = require('./calendar');
const axios = require('axios');
require('dotenv').config();

// Verifica se a API Key existe
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ API KEY da OpenAI não encontrada! Verifique seu arquivo .env');
  process.exit(1);
}

// Função para validar a API Key da OpenAI
async function validarAPIKeyOpenAI() {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    if (response.status === 200) {
      console.log('✅ API Key da OpenAI é válida.');
      return true;
    }
  } catch (error) {
    console.error('❌ Erro ao validar API Key:', error.response?.data || error.message);
    return false;
  }
}

// Inicializa o client do WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Gera o QR Code para autenticar
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Quando o bot estiver pronto
client.on('ready', async () => {
  const valido = await validarAPIKeyOpenAI();
  if (!valido) {
    console.error('❌ Bot encerrado por erro na API.');
    process.exit(1);
  }
  console.log('🤖 Bot está online e pronto para uso!');
});

// Quando receber uma mensagem
client.on('message', async (msg) => {
    console.log(`📩 Mensagem recebida: ${msg.body}`);
  
    const texto = msg.body.toLowerCase();
  
    // Comando especial de ajuda
    if (texto === '!ajuda') {
      const mensagemAjuda = `🤖 Comandos disponíveis:
  - *Agendar consulta*: Envie uma mensagem com as palavras "consulta" ou "agendar" + seu nome, data e hora.
  - *Assumir atendimento*: Diga "Eva deixa comigo" para pausar o bot.
  - *Perguntar qualquer coisa*: Pode conversar normalmente comigo.`;
  
      await msg.reply(mensagemAjuda);
      return;
    }
  
    // Novo comportamento: Eva deixa comigo
    if (texto.includes('eva deixa comigo')) {
      await msg.reply('Ok Sr Hugo, vou deixar o atendimento com você.');
      return; // Para aqui, não processa mais nada
    }
  
    // Se for uma mensagem de agendamento
    if (texto.includes('consulta') || texto.includes('agendar')) {
      const dados = await extrairDadosConsulta(msg.body);
  
      if (dados.nome && dados.dataHora) {
        try {
          const link = await agendarConsulta(dados.nome, dados.dataHora);
          await msg.reply(`✅ Consulta agendada com sucesso!\n📅 Nome: ${dados.nome}\n🕒 Horário: ${new Date(dados.dataHora).toLocaleString('pt-BR')}\n🔗 Link: ${link}`);
        } catch (err) {
          console.error('Erro ao agendar consulta:', err);
          await msg.reply('⚠️ Ocorreu um erro ao tentar agendar a consulta.');
        }
      } else {
        try {
          const resposta = await gerarResposta(msg.body);
          await msg.reply(`🤖 Resposta:\n${resposta}\n\n⚠️ Não consegui entender todos os dados da consulta. Poderia repetir com nome, data e horário?`);
        } catch (error) {
          console.error('Erro ao gerar resposta (dados incompletos):', error);
          await msg.reply('⚠️ Desculpe, houve um erro ao gerar a resposta. Por favor, tente novamente mais tarde.');
        }
      }
    } else {
      try {
        const resposta = await gerarResposta(msg.body);
        await msg.reply(resposta);
      } catch (error) {
        console.error('Erro ao gerar resposta:', error);
        await msg.reply('⚠️ Desculpe, houve um erro ao gerar a resposta. Por favor, tente novamente mais tarde.');
      }
    }
  });
  

// Inicializa o bot
client.initialize();

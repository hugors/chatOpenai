const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { gerarResposta, extrairDadosConsulta } = require('./openai');
const { agendarConsulta } = require('./calendar');
require('dotenv').config();

const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('🤖 Bot pronto!');
});

client.on('message', async (msg) => {
  const texto = msg.body.toLowerCase();

  if (texto.includes('consulta') || texto.includes('agendar')) {
    const dados = await extrairDadosConsulta(msg.body);

    if (dados.nome && dados.dataHora) {
      try {
        const link = await agendarConsulta(dados.nome, dados.dataHora);
        await msg.reply(`✅ Consulta agendada com sucesso!\n📅 Nome: ${dados.nome}\n🕒 Horário: ${new Date(dados.dataHora).toLocaleString('pt-BR')}\n🔗 Link: ${link}`);
      } catch (err) {
        await msg.reply('⚠️ Ocorreu um erro ao tentar agendar a consulta.');
        console.error(err);
      }
    } else {
      const resposta = await gerarResposta(msg.body);
      await msg.reply(`🤖 Resposta:\n${resposta}\n\n⚠️ Não consegui entender todos os dados da consulta. Poderia repetir com nome, data e horário?`);
    }
  } else {
    const resposta = await gerarResposta(msg.body);
    await msg.reply(resposta);
  }
});

client.initialize();

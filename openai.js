const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function gerarResposta(mensagemUsuario) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Você é uma assistente simpática de uma clínica médica. Responda com empatia e clareza.' },
      { role: 'user', content: mensagemUsuario }
    ]
  });

  return completion.choices[0].message.content.trim();
}

async function extrairDadosConsulta(texto) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Extraia o nome, data e hora de uma solicitação de consulta médica. 
Responda no formato JSON com os campos: nome, dataHora (em formato ISO 8601, como "2025-04-27T14:00:00"). 
Se algum dado não estiver claro, retorne null para ele.`
      },
      { role: 'user', content: texto }
    ],
    temperature: 0.2
  });

  try {
    const jsonMatch = completion.choices[0].message.content.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Erro ao extrair dados:', e);
  }

  return { nome: null, dataHora: null };
}

module.exports = { gerarResposta, extrairDadosConsulta };

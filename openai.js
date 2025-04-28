const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function gerarResposta(mensagemUsuario) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é uma assistente simpática de uma clínica médica. Responda com empatia e clareza.' },
        { role: 'user', content: mensagemUsuario }
      ]
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro no OpenAI (gerarResposta):', error?.message || error);
    return '⚠️ Desculpe, estou com problemas para gerar uma resposta agora.';
  }
}

async function extrairDadosConsulta(texto) {
  try {
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

    const jsonMatch = completion.choices[0].message.content.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Erro no OpenAI (extrairDadosConsulta):', error?.message || error);
  }

  return { nome: null, dataHora: null };
}

module.exports = { gerarResposta, extrairDadosConsulta };

const { google } = require('googleapis');
const { readFile } = require('fs/promises');

async function autorizarGoogleCalendar() {
  const credentials = JSON.parse(await readFile('credentials.json'));
  const { client_email, private_key } = credentials;
  
  const auth = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/calendar']
  );

  return google.calendar({ version: 'v3', auth });
}

async function agendarConsulta(nome, horario) {
  const calendar = await autorizarGoogleCalendar();
  
  const evento = {
    summary: `Consulta - ${nome}`,
    start: { dateTime: horario, timeZone: 'America/Sao_Paulo' },
    end: { dateTime: new Date(new Date(horario).getTime() + 30 * 60000).toISOString(), timeZone: 'America/Sao_Paulo' }
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    resource: evento
  });

  return res.data.htmlLink;
}

module.exports = { agendarConsulta };

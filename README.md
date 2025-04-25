# chatOpenai
chat boot humanizado

1. Criar um Projeto no Google Cloud
- Acesse Google Cloud Console.
- Crie um novo projeto ou selecione um projeto existente.
- O GOOGLE_PROJECT_ID é o identificador único do seu projeto. Você pode encontrá-lo na página inicial do projeto.

2. Habilitar a API do Google Calendar
- No painel do Google Cloud, vá para APIs & Serviços > Biblioteca.
- Procure por Google Calendar API e habilite-a para o seu projeto.

3. Criar uma Conta de Serviço
- Acesse APIs & Serviços > Credenciais.
- Clique em Criar Credenciais e selecione Conta de Serviço.
- Preencha os detalhes e clique em Criar.

4. Obter o EMAIL da Conta de Serviço
- Na lista de contas de serviço, encontre a conta recém-criada.
- O GOOGLE_CLIENT_EMAIL estará listado nas informações da conta (algo como email-do-servico@projeto-id.iam.gserviceaccount.com).

5. Gerar a Chave Privada
- Na página da conta de serviço, clique em Gerar Chave.
- Escolha o formato JSON e faça o download do arquivo.
- No arquivo JSON, você encontrará o GOOGLE_PRIVATE_KEY e o GOOGLE_CLIENT_EMAIL.

Importante: No arquivo JSON, a chave privada pode ter quebras de linha. Para usar no .env, substitua cada quebra de linha (\n) por \\n manualmente ou com um script.
6. Adicionar Permissões ao Google Calendar
- Entre no Google Calendar da conta que você quer usar.
- Abra as configurações do calendário e compartilhe-o com o e-mail da conta de serviço. Dê permissões para fazer alterações nos eventos.
- O CALENDAR_ID será o ID do calendário (geralmente, o e-mail da conta Google).

7. Configurar Variáveis no .env
- Preencha o .env com os valores obtidos:CALENDAR_ID=exemplo@gmail.com
GOOGLE_PROJECT_ID=meu-projeto
GOOGLE_CLIENT_EMAIL=servico@meu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."


Verificação Final
Certifique-se de que tudo está configurado corretamente e teste a integração para garantir que está funcionando como esperado.
Se precisar de mais detalhes ou tiver dúvidas, estou aqui para ajudar! 🚀✨


In [Your drive]:\Users\[Your user]\.aws\credentials, create credential with name [default], e.g.,:
[default]
aws_access_key_id=[insert_access_key_id_here]
aws_secret_access_key=[insert_secret_access_key_here]

Create .env in root directory with following params:
```env
PORT=3000

DISCORD_CLIENT_ID=[insert_id_here]
DISCORD_CLIENT_SECRET=[insert_secret_here]
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

```bash
# To download dependencies
npm run i
# To start application
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
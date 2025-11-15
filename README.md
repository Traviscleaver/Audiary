# Welcome to your GEEK LAND👋

1. Install dependencies

```sh
cd Audiary/server
npm install
```

2. Create the server/.env file

Inside Audiary/server/, create a file called:

server/.env

Put this inside it:

```
DATABASE_URL=your-supabase-url
JWT_SECRET=any-random-string
PORT=3000
```

3. Start the Express server

```sh
npm run dev
```

You MUST see:

Starting Audiary API server...
Server listening on 3000

4. Install Cloudflare Tunnel (Admin PowerShell)

```sh
winget install Cloudflare.Cloudflared
```

Restart terminal (not your PC — just the terminal).

5. Run Cloudflare Tunnel (Normal PowerShell)

```sh
cloudflared tunnel --protocol http2 --url http://localhost:3000

```

You will see:

Your quick Tunnel has been created!
https://something.trycloudflare.com

Copy this URL.

6. Put the API URL into the client .env file

Inside the main project root:

Audiary/.env

Put:

```
API_URL=https://something.trycloudflare.com

```

7. Hard reset Expo

```sh
npx expo start -c
```
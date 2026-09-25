# Lumina — aplicativo móvel

Aplicativo em React Native (Expo SDK 57) que consome a mesma API da aplicação
web, publicada em https://lumina-sd21.onrender.com.

## Abrir no celular (sem computador)

O aplicativo está publicado nos servidores da Expo e abre pelo **Expo Go**
em qualquer rede, inclusive dados móveis.

1. Instale o **Expo Go** (App Store ou Play Store).
2. Escaneie o QR code em [`docs/qr-app-expo-go.png`](../docs/qr-app-expo-go.png):
   no iPhone, pela câmera; no Android, pelo próprio Expo Go.
3. O primeiro acesso do dia pode levar até um minuto: o servidor gratuito
   hiberna quando fica ocioso.

Endereço contido no QR code:

```
exp://u.expo.dev/662b83de-5a93-4de8-8453-1599a1fc91f4?channel-name=pim-iv&runtime-version=exposdk:57.0.0
```

O QR code aponta para o canal `pim-iv`, e não para uma publicação
específica: continua válido depois de cada nova publicação.

## Publicar uma nova versão

Depois de alterar o código do aplicativo, na pasta `mobile`:

```
npm run publicar
```

Exige estar autenticado na conta Expo dona do projeto (`npx eas-cli login`).
Em alguns segundos o Expo Go passa a receber a versão nova; se não
aparecer, feche o aplicativo por completo e abra de novo.

## Desenvolvimento local

```
npm start
```

Escaneie o QR code exibido no terminal. Para testar contra uma API rodando
no computador, troque `API_URL` para `API_URL_DEV` em `src/config.js` e
ajuste o IP da máquina.

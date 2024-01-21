# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

before start backend add .env file

```
PORT=5000
DB_URL=**your mongodb url like mongodb+srv://admin:admin123456@cluster0.mypsuss.mongodb.net/?retryWrites=true&w=majority**
JWT_ACCESS_SECRET=jwt-secret-key
JWT_REFRESH_SECRET=jwt-refresh-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=**your gmail**
SMTP_PASSWORD=**disposable gmail password like eoisetvwjxgxkfgs**
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=**hereYourClientIdFromGoogle**.apps.googleusercontent.com
```

you don't have to write SMTP parameters if you want, then emails won't arrive
if you don't add GOOGLE_CLIENT_ID sign in with google won't work

to start client side

```
cd client
```

```
npm install
```

```
npm run dev
```

to start server side

```
cd ../
```

if you need return in main folder before

```
cd server
```

```
npm install
```

```
npm run dev
```

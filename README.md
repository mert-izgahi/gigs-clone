### SETUP EXPRESS SERVER

to start with we will need to set up the express server. so we need to install express and npm install express. then we need to setup index.js and start server with nodemon index.js

```js
import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log(`Server started on http://localhost:${3000}`);
});
```

### SETUP DOTENV

we need to install dotenv and npm install dotenv and setup .env file.

```js
import dotenv from "dotenv";
dotenv.config();
```

### FOLDER STRUCTURE

```tree
.
└── root/
    ├── package.json
    ├── package-lock.json
    ├── node_modules
    ├── index.js
    ├── .env
    ├── config.js
    └── src/
        ├── middlewares/
        │   ├── serialize-user-middlware.js
        │   ├── with-auth-middleware.js
        │   ├── error-handler-middleware.js
        │   ├── not-found-middleware.js
        │   └── ...
        ├── errors/
        │   ├── base-error.js
        │   ├── authentication-error.js
        │   ├── not-found-error.js
        │   ├── bad-request-error.js
        │   └── ...
        ├── helpers/
        │   ├── connect-db.js
        │   └── ...
        └── services/
            ├── users/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── gigs/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── reviews/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── orders/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            ├── chat/
            │   ├── model.js
            │   ├── router.js
            │   └── controller.js
            └── ...
```

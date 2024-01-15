import express from "express";
import config from "./config.js";
import connectDB from "./src/helpers/connect-db.js";
import errorHandler from "./src/middlewares/error-handler-middleware.js";
import notFound from "./src/middlewares/not-found-middleware.js";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = config.PORT;
app.listen(PORT, async () => {
    await connectDB(config.MONGO_URL);
    app.use(errorHandler);
    app.use(notFound);
    console.log(`Server started on http://localhost:${PORT}`);
});

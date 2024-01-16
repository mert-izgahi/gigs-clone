import express from "express";
import config from "./config.js";
import connectDB from "./src/helpers/connect-db.js";
import errorHandler from "./src/middlewares/error-handler-middleware.js";
import notFound from "./src/middlewares/not-found-middleware.js";
import { serializeUser } from "./src/middlewares/serialize-user-middleware.js";
import { router as usersRouter } from "./src/services/users/router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(serializeUser);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = config.PORT;
app.listen(PORT, async () => {
    await connectDB(config.MONGO_URL);

    // ROUTERS
    app.use("/api/v1", usersRouter);
    app.use(errorHandler);
    app.use(notFound);
    console.log(`Server started on http://localhost:${PORT}`);
});

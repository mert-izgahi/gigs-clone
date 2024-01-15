import express from "express";
import config from "./config.js";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

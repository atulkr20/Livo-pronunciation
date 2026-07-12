import express from "express";
import assessRouter from "./routes/assess";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});

app.use("/api", assessRouter);

app.listen(PORT, () => {
    console.log(`Server listeningn on PORT ${PORT}`);
});
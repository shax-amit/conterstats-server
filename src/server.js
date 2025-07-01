import express from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () =>
  console.log(`API running → http://localhost:${PORT}/health`)
);

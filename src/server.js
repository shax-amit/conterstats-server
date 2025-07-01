import express from "express";
import routes from "./routes/index.js";

const app = express();
import { PORT } from "./config.js";


app.use(express.json());
app.use("/", routes);

app.listen(PORT, () =>
  console.log(`API running → http://localhost:${PORT}/health`)
);

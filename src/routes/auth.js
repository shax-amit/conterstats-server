import { Router } from "express";
import { login } from "../controllers/auth.js";

const r = Router();
r.post("/login", login);

export default r;

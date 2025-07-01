import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/items.js";

const r = Router();

r.get("/", getAll);
r.get("/:id", getOne);
r.post("/",     /* authAdmin */ create);
r.patch("/:id", /* authAdmin */ update);
r.delete("/:id",/* authAdmin */ remove);

export default r;

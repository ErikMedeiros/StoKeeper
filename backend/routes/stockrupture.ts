import { Router } from "express";
import { db } from "../database/index.js";

const router = Router();

router.post("/", (request, response) => {
  const data = request.body;
  db;
});

export default router;

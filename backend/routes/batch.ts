import { Router } from "express";
import { db } from "../database/index.js";

const router = Router();

router.get("/", async (req, res) => {
    const batches = await db.selectFrom("batch")
        .selectAll()
        .execute();

    res.send(batches);
})

export default router;
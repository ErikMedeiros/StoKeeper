import { Router } from 'express'
import { db } from '../database/index.js';

const router = Router();

router.get("/", async (_, response) => {
    const result = await db.selectFrom("category")
        .selectAll()
        .execute()

    response.send(result);
});

router.post("/", async (request, response) => {
    const { name } = request.body;

    try {
        const category = await db.insertInto("category")
            .values({ name })
            .returning("id")
            .executeTakeFirstOrThrow()

        response.send({ categoryId: category.id });
    } catch (error) {
        const message = "erro ao cadastrar uma categoria";
        response.status(500).send({ message });
    }
});

export default router;

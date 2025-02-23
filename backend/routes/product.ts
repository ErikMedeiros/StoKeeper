import { Router } from "express";
import { db } from "../database/index.js";

const router = Router();

router.post("/", async (request, response) => {
    const { name, description } = request.body;

    try {
        const product = await db.insertInto("product")
            .values({ name, description })
            .returning("id")
            .executeTakeFirstOrThrow();

        response.send({ productId: product.id });
    } catch(error) {
        const message = "erro ao criar um produto"
        response.status(500).send({ message });
    }
});

router.put("/:id", async (request, response) => {
    const id = request.params.id;
    const { name, description } = request.body;

    try {
        const product = await db.updateTable("product")
            .where("id", "=", +id)
            .set({ name, description })
            .returning("id")
            .executeTakeFirstOrThrow();

        response.send({ productId: product.id });
    } catch(error) {
        const message = "erro ao atualizar o produto"
        response.status(500).send({ message });
    }
});

router.get("/", async (_, response) => {
    const result = await db.selectFrom("product")
        .selectAll()
        .execute()

    response.send(result);
});

export default router;

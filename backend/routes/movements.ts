import { Router } from 'express';
import { db } from '../database/index.js';

const router = Router();

router.get("/", async (_, response) => {
    const result = await db.selectFrom("movements")
        .selectAll()
        .execute()

    response.send(result);
});

router.post("/", async (request, response) => {
    const {  productId, employeeId, type, quantity, unitPrice } = request.body;
    const registeredAt = new Date().valueOf()

    try {
        const movement = await db.insertInto("movements")
            .values({ employeeId, productId, quantity, type, unitPrice, registeredAt })
            .returning("id")
            .executeTakeFirstOrThrow()

        response.send({ movementId: movement.id });
    } catch(error) {
        const message = "erro ao criar uma movimentação";
        response.status(500).send({ message });
    }
});

export default router;

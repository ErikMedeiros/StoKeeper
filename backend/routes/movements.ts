import { Router } from 'express';
import { db } from '../database/index.js';
import { sql } from 'kysely';

const router = Router();

router.get("/", async (request, response) => {
    const { name, categoryId, type, startDate, endDate } = request.query;
    let query = db.selectFrom("movements");
    
    if (!!name) query = query.where(sql`lower(name)`, 'like', sql`%lower('${name}')%`)
    if (type == "entrada" || type == "saida") query = query.where("type", "=", type);
    if (!!startDate) query = query.where("registeredAt", ">=", new Date(startDate.toString()).valueOf())
    if (!!endDate) query = query.where("registeredAt", "<=", new Date(endDate.toString()).valueOf())

    if (!!categoryId) {
        query = query.innerJoin("product", "product.id", "movements.productId")
            .where("product.categoryId", '=', +categoryId)
    }

    const result = await query
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

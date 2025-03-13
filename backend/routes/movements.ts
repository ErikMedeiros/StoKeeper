import { Router } from 'express';
import { db } from '../database/index.js';

const router = Router();

router.get("/", async (request, response) => {
    const { name, categoryId, type, startDate, endDate } = request.query;
    let query = db
      .selectFrom("movements")
      .innerJoin("product", "product.id", "movements.productId")
      .innerJoin("category", "category.id", "product.categoryId")
      .innerJoin("employee", "employee.id", "movements.employeeId");
    
    if (!!name) query = query.where('product.name', 'like', '%' + name + '%');
    if (type == "entrada" || type == "saida") query = query.where("type", "=", type);
    if (!!categoryId) query = query.where("product.categoryId", '=', +categoryId);
    if (!!startDate) query = query.where("registeredAt", ">=", new Date(startDate.toString()));
    if (!!endDate) query = query.where("registeredAt", "<=", new Date(endDate.toString()));

    const result = await query
      .select([
        "movements.id",
        "movements.type",
        "movements.unitPrice",
        "movements.quantity",
        "movements.registeredAt",
        "movements.expiresAt",
        "product.id as productId",
        "product.name as productName",
        "product.notifyBeforeExpiresDays",
        "category.name as categoryName",
        "employee.name as employeeName"
      ])
      .execute();

    response.send(result);
});

router.post("/", async (request, response) => {
    const {  productId, employeeId, type, unitPrice } = request.body;
    let { quantity, expiresAt } = request.body;
    const registeredAt = new Date()

    switch (type) {
      case "entrada":
        if (!!expiresAt) expiresAt = new Date(expiresAt);
        else expiresAt = null;
        break;
      case "saida":
        quantity *= -1;
        expiresAt = null;
        break;
    }
    
    try {
        const movement = await db.insertInto("movements")
            .values({ employeeId, productId, quantity, type, unitPrice, registeredAt, expiresAt })
            .returning("id")
            .executeTakeFirstOrThrow()

        response.send({ movementId: movement.id });
    } catch(error) {
        const message = "erro ao criar uma movimentação";
        response.status(500).send({ message });
    }
});

export default router;

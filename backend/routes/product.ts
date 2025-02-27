import { Router } from "express";
import { db } from "../database/index.js";
import { sql } from "kysely";

const router = Router();

router.post("/", async (request, response) => {
    const { name, description, categoryId } = request.body;

    console.log(name, description, categoryId);

    try {
        const product = await db.insertInto("product")
            .values({ name, description, categoryId: +categoryId })
            .returning("id")
            .executeTakeFirstOrThrow();

        response.send({ productId: product.id });
    } catch(error) {
        console.error(error)
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

router.get("/", async (request, response) => {
    const { name, categoryId } = request.query;

    let query = db.selectFrom("product");
    if (!!name) query = query.where(sql`lower(name)`, "like", sql`%lower('${name}')%`)
    if (!!categoryId) query = query.where("categoryId", "=", +categoryId)

    const result = await query
        .innerJoin("category", "category.id", "product.categoryId")
        .leftJoin('movements', "movements.productId", "product.id")
        .select([
            'product.id', 
            'product.name', 
            'product.description', 
            'category.name as categoryName', 
            "movements.quantity", 
            "movements.unitPrice"
        ])
        .execute()

    response.send(result);
});

export default router;

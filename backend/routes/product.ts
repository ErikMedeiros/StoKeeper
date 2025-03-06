import { Router } from "express";
import { sql } from "kysely";
import { db } from "../database/index.js";

const router = Router();

router.post("/", async (request, response) => {
  const { name, description, categoryId } = request.body;

  try {
    const product = await db
      .insertInto("product")
      .values({ name, description, categoryId: +categoryId })
      .returning("id")
      .executeTakeFirstOrThrow();

    response.send({ productId: product.id });
  } catch (error) {
    const message = "erro ao criar um produto";
    response.status(500).send({ message });
  }
});

router.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { name, description } = request.body;

  try {
    const product = await db
      .updateTable("product")
      .where("id", "=", +id)
      .set({ name, description })
      .returning("id")
      .executeTakeFirstOrThrow();

    response.send({ productId: product.id });
  } catch (error) {
    const message = "erro ao atualizar o produto";
    response.status(500).send({ message });
  }
});

router.get("/", async (request, response) => {
  const { name, categoryId } = request.query;

  let query = db.selectFrom("product");
  if (!!name)
    query = query.where(sql`lower(name)`, "like", sql`%lower('${name}')%`);
  if (!!categoryId) query = query.where("categoryId", "=", +categoryId);

  const result = await query
    .innerJoin("category", "category.id", "product.categoryId")
    .select(({ selectFrom }) => [
      "product.id",
      "product.name",
      "product.description",
      "category.name as categoryName",
      "category.id as categoryId",
      selectFrom("movements")
        .whereRef("productId", "=", "product.id")
        .select(({ fn: { sum, coalesce }, lit }) =>
          coalesce(sum("quantity"), lit(0)).as("quantity")
        )
        .as("quantity"),
      selectFrom("movements")
        .whereRef("productId", "=", "product.id")
        .select(({ fn: { avg, coalesce }, lit }) =>
          coalesce(avg("unitPrice"), lit(0)).as("unitPrice")
        )
        .as("averageUnitPrice"),
    ])
    .execute();

  response.send(result);
});

export default router;

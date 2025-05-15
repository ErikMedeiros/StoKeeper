import { Router } from "express";
import { db } from "../database/index.js";

const router = Router();

router.get("/", async (request, response) => {
  const { name, categoryId, type, startDate, endDate } = request.query;
  let query = db
    .selectFrom("movements")
    .innerJoin("product", "product.id", "movements.productId")
    .innerJoin("category", "category.id", "product.categoryId")
    .innerJoin("employee", "employee.id", "movements.employeeId")
    .leftJoin("batch", "batch.id", "movements.batchId");

  if (!!name) query = query.where("product.name", "like", "%" + name + "%");
  if (type == "entrada" || type == "saida")
    query = query.where("type", "=", type);
  if (!!categoryId) query = query.where("product.categoryId", "=", +categoryId);
  if (!!startDate)
    query = query.where("registeredAt", ">=", new Date(startDate.toString()));
  if (!!endDate)
    query = query.where("registeredAt", "<=", new Date(endDate.toString()));

  const result = await query
    .select([
      "movements.id",
      "movements.type",
      "movements.unitPrice",
      "movements.quantity",
      "movements.registeredAt",
      "batch.id as batchId",
      "batch.expiresAt",
      "product.id as productId",
      "product.name as productName",
      "product.notifyBeforeExpiresDays",
      "category.name as categoryName",
      "employee.name as employeeName",
      "movements.comment",
    ])
    .execute();

  response.send(result);
});

router.post("/", async (request, response) => {
  try {
    const id = await createMovement(
      request.body.productId,
      request.body.employeeId,
      request.body.type,
      request.body.unitPrice,
      request.body.batchId,
      request.body.quantity,
      request.body.expiresAt
    );

    response.send({ movementId: id });
  } catch (error) {
    const message = "erro ao criar uma movimentação";
    response.status(500).send({ message });
  }
});

export async function createMovement(
  productId: number,
  employeeId: number,
  type: "entrada" | "saida",
  unitPrice: number,
  batchId: string,
  quantity: number,
  expireDate: string,
  comment: string = "Criado automaticamente pelo inventário"
) {
  const registeredAt = new Date();
  let expiresAt: Date | null = null;

  switch (type) {
    case "entrada":
      if (!!expireDate) expiresAt = new Date(expireDate);
      else expiresAt = null;
      break;
    case "saida":
      quantity *= -1;
      expiresAt = null;
      break;
  }

  var batch = await db
    .selectFrom("batch")
    .where("batch.id", "=", batchId)
    .select("id")
    .executeTakeFirst();

  if (!batch) {
    if (type === "entrada") {
      batch = await db
        .insertInto("batch")
        .values({ id: batchId, quantity: 0, productId, expiresAt: expiresAt! })
        .returning("id")
        .executeTakeFirstOrThrow();
    } else {
      throw new Error("Lote não encontrado");
    }
  }

  await db
    .updateTable("batch")
    .set((eb) => ({ quantity: eb("quantity", "+", quantity) }))
    .where("id", "=", batch.id)
    .execute();

  const movement = await db
    .insertInto("movements")
    .values({
      employeeId,
      productId,
      quantity,
      type,
      unitPrice,
      registeredAt,
      batchId: batch.id,
      comment,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  return movement.id;
}

router.get("/rupture", async (req, res) => {
  const productId = +(req.query.productId ?? "0");
  const batchId = req.query.batchId?.toString() ?? "";
  const quantity = +(req.query.quantity ?? "0");

  let query = db
    .selectFrom("batch")
    .where("productId", "=", productId)
    .groupBy(["id", "productId"])
    .select((eb) => eb(eb.fn.sum("quantity"), "-", quantity).as("quantity"));
  if (!!batchId) query = query.where("id", "=", batchId);

  const data = await query.executeTakeFirst();

  type Output = Exclude<typeof data, undefined>;
  res.send(data ?? ({ quantity } satisfies Output));
});

export default router;

import { Router } from "express";
import { db } from "../database/index.js";
import { createMovement } from "./movements.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { employeeId } = request.query;
    const params = request.body;
    const products = params.map((p: any) => p.productId);
    const batches = params.map((p: any) => p.batchId);

    const result = await db
      .selectFrom("product")
      .leftJoin("batch", "batch.productId", "product.id")
      .where("product.id", "in", products)
      .where("batch.id", "in", batches)
      .select(({ fn: { coalesce }, lit }) => [
        "product.id as productId",
        "batch.id as batchId",
        coalesce("batch.quantity", lit(0)).as("quantity"),
      ])
      .execute();

    const movements: number[] = [];
    for (const entry of params) {
      const index = result.findIndex(
        (d) => d.productId == entry.productId && d.batchId == entry.batchId
      );

      if (index === -1) {
        const id = await createMovement(
          entry.productId,
          +employeeId!,
          "entrada",
          entry.unitPrice,
          entry.batchId,
          entry.quantity,
          entry.expiresAt,
          entry.comment
        );

        movements.push(id);
      } else {
        const quantity = entry.quantity - (result[index]?.quantity ?? 0);
        const type = quantity < 0 ? "saida" : "entrada";

        const id = await createMovement(
          entry.productId,
          +employeeId!,
          type,
          entry.unitPrice,
          entry.batchId,
          quantity * -1,
          entry.expiresAt,
          entry.comment
        );

        movements.push(id);
      }
    }

    response.send({ movements });
  } catch (error) {
    console.error(error);

    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;

    response.status(500).send({ message });
  }
});

export default router;

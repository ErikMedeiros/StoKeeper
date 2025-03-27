import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema.createTable("batch")
        .addColumn("id", "text", col => col.primaryKey())
        .addColumn("productId", "integer", col => col.notNull().references("product.id"))
        .addColumn("quantity", "integer", col => col.notNull().check(sql`quantity >= 0`))
        .addColumn("expiresAt", "timestamp")
        .execute();
    
    await db.schema.alterTable("movements")
        .dropColumn("expiresAt")
        .addColumn("batchId", "text", col => col.references("batch.id"))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.alterTable("movements")
      .dropColumn("batchId")
      .addColumn("expiresAt", "timestamp", (col) => col.defaultTo(null))
      .execute();
    
    await db.schema.dropTable("batch").execute();
}

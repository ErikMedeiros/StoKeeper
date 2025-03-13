import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("category")
    .addColumn("id", "serial", col => col.primaryKey())
    .addColumn("name", "varchar", col => col.notNull())
    .execute();

  await db.insertInto("category")
    .values([{ name: "Limpeza" }, { name: "Alimentos" }, { name: "Eletrodomêsticos" }])
    .execute()

  await db.schema
    .alterTable("product")
    .addColumn("categoryId", "integer", col => col.references("category.id").notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .dropTable("category")
    .execute();

  await db.schema
    .alterTable("product")
    .dropColumn("categoryId")
    .execute();
}

import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("movements")
    .addColumn("comment", "text", (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("movements")
    .dropColumn("comment")
    .execute();
}

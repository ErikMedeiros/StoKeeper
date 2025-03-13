import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("product")
    .addColumn("notifyBeforeExpiresDays", "integer", (col) => col.defaultTo(null))
    .execute();

  await db.schema
    .alterTable("movements")
    .addColumn("expiresAt", "integer", (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("product")
    .dropColumn("notifyBeforeExpiresDays")
    .execute();

  await db.schema.alterTable("movements")
    .dropColumn("expiresAt")
    .execute();
}

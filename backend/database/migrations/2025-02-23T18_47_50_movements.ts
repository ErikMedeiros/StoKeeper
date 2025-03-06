import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .dropTable("storage")
    .execute();

  await db.schema
    .createTable("product")
    .addColumn("id", "integer", col => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar", col => col.notNull())
    .addColumn("description", "varchar", col => col.notNull())
    .execute();

  await db.schema
    .createTable("movements")
    .addColumn("id", "integer", col => col.autoIncrement().primaryKey())
    .addColumn("productId", "integer", col => col.references("product.id").notNull())
    .addColumn("employeeId", "integer", col => col.references("employee.id").notNull())
    .addColumn("type", "varchar", col => col.check(sql`type in ('entrada', 'saida')`))
    .addColumn("quantity", "integer")
    .addColumn("unitPrice", "real", col => col.check(sql`unitPrice > 0`))
    .addColumn("registeredAt", "integer", col => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .createTable('storage')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('productName', 'varchar', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('unitPrice', 'real', (col) => col.notNull())
    .execute()

  await db.schema
    .dropTable("product")
    .execute();

  await db.schema
    .dropTable("movements")
    .execute();
}

import { Kysely } from "kysely"

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('storage')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('productName', 'varchar', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('unitPrice', 'numeric', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('storage').execute()
}

import { Kysely } from "kysely"

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('storage')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('productName', 'varchar', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('unitPrice', 'real', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('storage').execute()
}

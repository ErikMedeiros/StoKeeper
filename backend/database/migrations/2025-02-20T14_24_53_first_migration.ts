import { Kysely } from "kysely"

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('employee')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('salary', 'integer', (col) => col.notNull())
    .addColumn('position', 'varchar', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('employee').execute()
}

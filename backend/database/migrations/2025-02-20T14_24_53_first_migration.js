/** 
 * @param {import('kysely').Kysely} db
 * @returns {Promise<void>}
 */ 
export async function up(db) {
  await db.schema
    .createTable('employee')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('salary', 'integer', (col) => col.notNull())
    .addColumn('position', 'varchar', (col) => col.notNull())
    .execute()
}

/** 
 * @param {import('kysely').Kysely} db
 * @returns {Promise<void>}
 */ 
export async function down(db) {
  await db.schema.dropTable('employee').execute()
}

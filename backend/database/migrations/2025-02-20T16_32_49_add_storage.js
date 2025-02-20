/** 
 * @param {import('kysely').Kysely} db
 * @returns {Promise<void>}
 */ 
export async function up(db) {
  await db.schema
    .createTable('storage')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('productName', 'varchar', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('unitPrice', 'real', (col) => col.notNull())
    .execute()
}

/** 
 * @param {import('kysely').Kysely} db
 * @returns {Promise<void>}
 */ 
export async function down(db) {
  await db.schema.dropTable('storage').execute()
}

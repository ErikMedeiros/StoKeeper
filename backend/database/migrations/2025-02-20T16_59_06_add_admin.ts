import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('employee')
    .addColumn('username', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .alterTable('employee')
    .addColumn('password', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .alterTable("employee")
    .addColumn('isAdmin', 'integer', (col) => col.defaultTo(0))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('employee')
    .dropColumn("username")
    .execute()

  await db.schema.alterTable('employee')
    .dropColumn("password")
    .execute()

  await db.schema.alterTable("employee")
    .dropColumn("isAdmin")
    .execute()
}

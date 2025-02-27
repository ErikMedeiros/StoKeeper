import bcrypt from "bcryptjs";
import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('employee')
    .addColumn('username', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .alterTable('employee')
    .addColumn('password', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .alterTable('employee')
    .addColumn('isAdmin', 'integer', (col) => col.defaultTo(0))
    .execute();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin", salt);

  await db.insertInto("employee")
    .values({
      username: "admin",
      name: "Admin",
      position: "Gestor Geral",
      salary: 5000,
      isAdmin: 1,
      password: hashedPassword 
    })
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom("employee")
    .where("username", "=", "admin")
    .execute();

  await db.schema.alterTable('employee')
    .dropColumn("username")
    .execute()

  await db.schema.alterTable('employee')
    .dropColumn("password")
    .execute()

  await db.schema.alterTable('employee')
    .dropColumn("isAdmin")
    .execute()
}

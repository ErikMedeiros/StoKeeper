import * as path from 'path'
import fs from 'fs/promises'
import { Kysely, SqliteDialect, Migrator, FileMigrationProvider } from 'kysely'
import SQLite from 'better-sqlite3';

const dialect = new SqliteDialect({
    database: new SQLite('./database.db')
});

/** @type {Kysely<import('./index.js').Database>} */
export const db = new Kysely({ dialect });

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(import.meta.dirname, 'migrations'),
    }),
})

const { error, results } = await migrator.migrateToLatest()

results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
})

if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
}

await db.destroy()

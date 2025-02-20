import { defineConfig } from 'kysely-ctl'
import { db } from './database/index.js'

export default defineConfig({
	kysely: db,
	migrations: {
	  migrationFolder: "./database/migrations",
	},
})

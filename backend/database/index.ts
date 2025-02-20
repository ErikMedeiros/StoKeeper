import type {
    Generated,
    Insertable,
    Selectable,
    Updateable
} from 'kysely';
import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';

export type Database = {
    employee: EmployeeTable,
    storage: StorageTable,
};

export type EmployeeTable = {
    id: Generated<number>,
    username: string,
    name: string,
    password: string,
    salary: number,
    position: string,
    isAdmin: number,
}

export type Employee = Selectable<EmployeeTable>;
export type CreateEmployee = Insertable<EmployeeTable>;
export type UpdateEmployee = Updateable<EmployeeTable>;

export type StorageTable = {
    id: Generated<number>
    productName: string,
    quantity: number,
    unitPrice: number,
}

export type Storage = Selectable<StorageTable>;
export type CreateStorage = Insertable<StorageTable>;
export type UpdateStorage = Updateable<StorageTable>;

const dialect = new SqliteDialect({
    database: new SQLite('./database.db')
});

export const db = new Kysely<Database>({ dialect });

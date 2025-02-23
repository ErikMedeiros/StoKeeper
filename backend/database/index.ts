import type {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable
} from 'kysely';
import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';

export type Database = {
    employee: EmployeeTable,
    product: ProductTable,
    category: CategoryTable,
    movements: MovementTable,
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

export type ProductTable = {
    id: Generated<number>
    categoryId: number,
    name: string,
    description: string,
}

export type Product = Selectable<ProductTable>;
export type CreateProduct = Insertable<ProductTable>;
export type UpdateProduct = Updateable<ProductTable>;

export type CategoryTable = {
    id: Generated<number>
    name: string,
}

export type Category = Selectable<CategoryTable>;
export type CreateCategory = Insertable<CategoryTable>;
export type UpdateCategory = Updateable<CategoryTable>;

export type MovementTable = {
    id: Generated<number>
    productId: number,
    employeeId: number,
    type: "entrada" | "saida",
    quantity: number,
    unitPrice: number,
    registeredAt: ColumnType<number, number, never>,
}

export type Movement = Selectable<MovementTable>;
export type CreateMovement = Insertable<MovementTable>;
export type UpdateMovement = Updateable<MovementTable>;

const dialect = new SqliteDialect({
    database: new SQLite('./database.db')
});

export const db = new Kysely<Database>({ dialect });

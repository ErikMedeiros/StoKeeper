import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

export type Database = {
  employee: EmployeeTable;
  product: ProductTable;
  category: CategoryTable;
  movements: MovementTable;
  batch: BatchTable;
};

export type EmployeeTable = {
  id: Generated<number>;
  username: string;
  name: string;
  password: string;
  salary: number;
  position: string;
  isAdmin: number;
};

export type Employee = Selectable<EmployeeTable>;
export type CreateEmployee = Insertable<EmployeeTable>;
export type UpdateEmployee = Updateable<EmployeeTable>;

export type ProductTable = {
  id: Generated<number>;
  categoryId: number;
  name: string;
  description: string;
  notifyBeforeExpiresDays: number | null;
};

export type Product = Selectable<ProductTable>;
export type CreateProduct = Insertable<ProductTable>;
export type UpdateProduct = Updateable<ProductTable>;

export type CategoryTable = {
  id: Generated<number>;
  name: string;
};

export type Category = Selectable<CategoryTable>;
export type CreateCategory = Insertable<CategoryTable>;
export type UpdateCategory = Updateable<CategoryTable>;

export type MovementTable = {
  id: Generated<number>;
  productId: number;
  employeeId: number;
  type: "entrada" | "saida";
  quantity: number;
  unitPrice: number;
  registeredAt: ColumnType<Date, Date, never>;
  batchId: number;
};

export type Movement = Selectable<MovementTable>;
export type CreateMovement = Insertable<MovementTable>;
export type UpdateMovement = Updateable<MovementTable>;

export type BatchTable = {
  id: Generated<number>;
  productId: number;
  quantity: number;
  expiresAt?: ColumnType<Date, Date, never>;
};

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL
  }),
});

export const db = new Kysely<Database>({ dialect });

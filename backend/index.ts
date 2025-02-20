import express from 'express';
import { db } from './database/index.js';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/ping", (_, response) => {
    response.send({ message: "projeto rodando!"})
});

app.post("/employee", async (request, response) => {
    const { username, name, position, salary, isAdmin, password } = request.body;

    const existing = await db.selectFrom("employee")
        .where('username', '=', username)
        .select('id')
        .executeTakeFirst();

    if (!!existing) {
        response.send({ message: "login já utilizado" });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await db.insertInto("employee")
        .values({ username, name, position, salary, isAdmin: isAdmin === 'true' ? 1 : 0, password: hashedPassword })
        .returning('id')
        .executeTakeFirstOrThrow()

    response.send({ employeeId: employee.id });
});

app.put("/employee/:id", async (request, response) => {
    const id = request.params.id;
    const { name, position, salary, isAdmin } = request.body;

    const employee = await db.updateTable("employee")
        .where('id', '=', +id)
        .set({ name, position, salary, isAdmin })
        .returning('id')
        .executeTakeFirstOrThrow()

    response.send({ employeeId: employee.id });
});

app.get("/employee/:username/:password", async (request, response) => {
    const { username, password } = request.params;

    const user = await db.selectFrom("employee")
        .where('name', '=', username)
        .select('password')
        .executeTakeFirstOrThrow();

    const match = await bcrypt.compare(password, user.password);
    
    response.send({ login: match });
});

app.get("/employees", async (_, response) => {
    const result = await db.selectFrom("employee")
        .selectAll()
        .execute()

    response.send(result);
});

app.post("/storage", async (request, response) => {
    const { productName, quantity, unitPrice  } = request.body;

    const storage = await db.insertInto("storage")
        .values({ productName, quantity, unitPrice })
        .returning("id")
        .executeTakeFirst();

    response.send({ storageId: storage?.id });
});

app.put("/storage/:id", async (request, response) => {
    const id = request.params.id;
    const { productName, quantity, unitPrice  } = request.body;

    const storage = await db.updateTable("storage")
        .where("id", "=", +id)
        .set({ productName, quantity, unitPrice })
        .returning("id")
        .executeTakeFirstOrThrow();

    response.send({ storageId: storage.id });
});

app.get("/storages", async (_, response) => {
    const result = await db.selectFrom("storage")
        .selectAll()
        .execute()

    response.send(result);
});

app.listen(5000, () => console.log("servidor rodando em http://localhost:5000"))

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

    try {
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
    } catch(error) {
        const message = "erro ao criar um funcionário"
        response.status(500).send({ message });
    }
});

app.put("/employee/:id", async (request, response) => {
    const id = request.params.id;
    const { name, position, salary, isAdmin } = request.body;

    try {
        const employee = await db.updateTable("employee")
            .where('id', '=', +id)
            .set({ name, position, salary, isAdmin })
            .returning('id')
            .executeTakeFirstOrThrow()

        response.send({ employeeId: employee.id });
    } catch(error) {
        const message = "erro ao atualizar um funcionário"
        response.status(500).send({ message });
    }
});

app.get("/employee/:username/:password", async (request, response) => {
    const { username, password } = request.params;

    try {
        const user = await db.selectFrom("employee")
            .where('name', '=', username)
            .select('password')
            .executeTakeFirstOrThrow();

        const match = await bcrypt.compare(password, user.password);
        
        response.send({ login: match });
    } catch(error) {
        const message = "login e/ou senha incorreta"
        response.status(500).send({ message });
    }
});

app.get("/employees", async (_, response) => {
    const result = await db.selectFrom("employee")
        .selectAll()
        .execute()

    response.send(result);
});

app.post("/storage", async (request, response) => {
    const { productName, quantity, unitPrice  } = request.body;

    try {
        const storage = await db.insertInto("storage")
            .values({ productName, quantity, unitPrice })
            .returning("id")
            .executeTakeFirstOrThrow();

        response.send({ storageId: storage.id });
    } catch(error) {
        const message = "erro ao criar um item no armazem"
        response.status(500).send({ message });
    }
});

app.put("/storage/:id", async (request, response) => {
    const id = request.params.id;
    const { productName, quantity, unitPrice  } = request.body;

    try {
        const storage = await db.updateTable("storage")
            .where("id", "=", +id)
            .set({ productName, quantity, unitPrice })
            .returning("id")
            .executeTakeFirstOrThrow();

        response.send({ storageId: storage.id });
    } catch(error) {
        const message = "erro ao atualizar um item do armazem"
        response.status(500).send({ message });
    }
});

app.get("/storages", async (_, response) => {
    const result = await db.selectFrom("storage")
        .selectAll()
        .execute()

    response.send(result);
});

app.listen(5000, () => console.log("servidor rodando em http://localhost:5000"))

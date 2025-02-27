import bcrypt from "bcryptjs";
import { Router } from "express";
import { db } from "../database/index.js";

const router = Router()

router.post("/", async (request, response) => {
    const { username, name, position, salary, isAdmin, password } = request.body;

    try {
        const existing = await db.selectFrom("employee")
            .where('username', '=', username)
            .select('id')
            .executeTakeFirst();

        if (!!existing) {
            response.status(500).send({ message: "login já utilizado" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await db.insertInto("employee")
            .values({ username, name, position, salary, isAdmin: isAdmin ? 1 : 0, password: hashedPassword })
            .returning('id')
            .executeTakeFirstOrThrow()

        response.send({ employeeId: employee.id });
    } catch(error) {
        const message = "erro ao criar um funcionário"
        response.status(500).send({ message });
    }
});

router.put("/:id", async (request, response) => {
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

router.get("/admin/:id", async (request, response) => {
    const id = request.params.id;

    try {
        const employee = await db.selectFrom("employee")
            .where("id", '=', +id)
            .select("isAdmin")
            .executeTakeFirstOrThrow()

        response.send({ isAdmin: employee.isAdmin == 1 });
    } catch (error) {
        response.send({ isAdmin: false })
    }
});

router.get("/login", async (request, response) => {
    const { username, password } = request.query;

    try {
        const user = await db.selectFrom("employee")
            .where('name', '=', username!.toString())
            .select(['password', 'id'])
            .executeTakeFirstOrThrow();

        const match = await bcrypt.compare(password!.toString(), user.password);
        response.send({ userId: match ? user.id : null });
    } catch(error) {
        const message = "login e/ou senha incorreta"
        response.status(500).send({ message });
    }
});

router.get("/", async (_, response) => {
    const result = await db.selectFrom("employee")
        .selectAll()
        .execute()

    response.send(result);
});

export default router;

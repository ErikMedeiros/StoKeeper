import { Router } from "express";

const router = Router();

router.get("/", (_, response) => {
    response.send({ message: "Rota de Quebra de Estoque acessada com sucesso!" });
});

export default router;

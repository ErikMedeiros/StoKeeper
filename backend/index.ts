import express from 'express';
import cors from 'cors';
import EmployeeRoutes from './routes/employee.js';
import ProductRoutes from './routes/product.js';
import MovementsRoutes from './routes/movements.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/ping", (_, response) => {
    response.send({ message: "projeto rodando!"})
});


app.use("/employee", EmployeeRoutes);
app.use("/product", ProductRoutes);
app.use("/movements", MovementsRoutes);

app.listen(5000, () => console.log("servidor rodando em http://localhost:5000"))

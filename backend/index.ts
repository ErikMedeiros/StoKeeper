import express from "express";
import cors from "cors";
import EmployeeRoutes from "./routes/employee.js";
import ProductRoutes from "./routes/product.js";
import MovementsRoutes from "./routes/movements.js";
import CategoryRoutes from "./routes/category.js";
import BatchRoutes from "./routes/batch.js";
import StockRupture from "./routes/stockrupture.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/ping", (_, response) => {
  response.send({ message: "projeto rodando!" });
});

app.use("/employee", EmployeeRoutes);
app.use("/product", ProductRoutes);
app.use("/movements", MovementsRoutes);
app.use("/category", CategoryRoutes);
app.use("/batch", BatchRoutes);
app.use("/stockrupture", StockRupture);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`servidor rodando em http://localhost:${PORT}`)
);

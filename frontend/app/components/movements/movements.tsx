import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as backend from "../../backend";
import style from "./Movements.module.scss";

interface Movement {
  id: number;
  productName: string;
  categoryName: string;
  employeeName: string;
  type: string;
  quantity: number;
  batchId?: number;
  unitPrice: number;
  registeredAt: string;
  expiresAt?: string;
  notifyBeforeExpiresDays?: number;
}

interface Category {
  id: number;
  name: string;
}

export function Movements() {
  const navigate = useNavigate();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    categoryId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await backend.getMovements(
        filters.name,
        filters.type,
        filters.categoryId,
        filters.startDate,
        filters.endDate
      );

      setMovements(response);
    }, 750);

    return () => clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    backend.getCategories().then(setCategories);
  }, []);

  return (
    <>
      <div className={style.filtros}>
        <div className={style.filtros__produto}>
          <label
            htmlFor="product-name"
            className={style.filtros__produto__label}
          >
            Produto
          </label>
          <input
            type="text"
            id="product-name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className={style.filtros__produto__input}
          />
        </div>

        <div className={style.filtros__tipo}>
          <label htmlFor="movement-type">Tipo</label>
          <select
            id="movement-type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className={style.filtros__tipo__input}
          >
            <option value="">Selecione uma opção</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <div className={style.filtros__categoria}>
          <label htmlFor="category-id">Categoria</label>
          <select
            id="category-id"
            value={filters.categoryId}
            onChange={(e) =>
              setFilters({ ...filters, categoryId: e.target.value })
            }
            className={style.filtros__categoria__input}
          >
            <option value="">Selecione uma opção</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.filtros__data_inicio}>
          <label htmlFor="start-date">Data Inicial</label>
          <input
            type="datetime-local"
            id="start-date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className={style.filtros__data_inicio__input}
          />
        </div>

        <div className={style.filtros__data_fim}>
          <label htmlFor="end-date">Data Final</label>
          <input
            type="datetime-local"
            id="end-date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className={style.filtros__data_fim__input}
          />
        </div>
      </div>

      <div className={style.div_table}>
        <table className={style.div_table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Funcionário</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Lote</th>
              <th>Preço Unitário</th>
              <th>Data e Hora</th>
              <th>Data de Validade</th>
            </tr>
          </thead>
          <tbody className={style.tabela}>
            {movements.map((entry) => {
              const registeredAt = new Date(
                entry.registeredAt
              ).toLocaleString();
              const expiresAt = entry.expiresAt
                ? new Date(entry.expiresAt).toLocaleString()
                : "-";
              const notifyDate =
                entry.expiresAt && entry.notifyBeforeExpiresDays
                  ? new Date(entry.expiresAt)
                  : null;
              let color = "";

              if (
                entry.notifyBeforeExpiresDays !== undefined &&
                entry.expiresAt
              ) {
                const days = entry.notifyBeforeExpiresDays;
                const notifyDate = new Date(entry.expiresAt);
                notifyDate.setDate(notifyDate.getDate() - days + 1);

                if (new Date().valueOf() <= notifyDate.valueOf()) {
                  color = "lightcoral";
                }
              }

              return (
                <tr
                  key={entry.id}
                  id={`movement-${entry.id}`}
                  className={style.tabela__linha}
                >
                  <td className={style.tabela__linha__dados}>
                    {entry.productName}
                  </td>
                  <td className={style.tabela__linha__dados}>
                    {entry.categoryName}
                  </td>
                  <td className={style.tabela__linha__dados}>
                    {entry.employeeName}
                  </td>
                  <td className={style.tabela__linha__dados}>{entry.type}</td>
                  <td className={style.tabela__linha__dados}>
                    {Math.abs(entry.quantity)}
                  </td>
                  <td className={style.tabela__linha__dados}>
                    Lote #{entry.batchId ?? ""}
                  </td>
                  <td className={style.tabela__linha__dados}>
                    R$ {entry.unitPrice.toFixed(2)}
                  </td>
                  <td className={style.tabela__linha__dados}>{registeredAt}</td>
                  <td className={style.tabela__linha__dados} style={{ color }}>
                    {expiresAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import style from "./Movements.module.scss";
import { navigateTo } from "~/utils/navigateTo";

const BASE_URL = "https://backend-production-cec8.up.railway.app";

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
    productName: "",
    movementType: "",
    categoryId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadMovements();
    }, 750);
    return () => clearTimeout(timeout);
  }, [filters]);

  async function loadMovements() {
    const url = new URL("movements", BASE_URL);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());
    const data: Movement[] = await response.json();
    setMovements(data);
  }

  async function loadCategories() {
    const response = await fetch(`${BASE_URL}/category`);
    const data: Category[] = await response.json();
    setCategories(data);
  }

  useEffect(() => {
    loadMovements();
    loadCategories();
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.container__header}>
          <img
            src="../image/stokeeper_logo.png"
            alt="StoKeeper Logo"
            loading="lazy"
            draggable="false"
            className={style.container__header__imagem}
          />

          <h1 className={style.container__header__titulo}>Movimentações</h1>

          <div className={style.container__header__button}>
            <button
              onClick={() => navigateTo(navigate, "/reports")}
              className={style.container__header__button_botao}
            >
              Relatório
            </button>
            <button
              onClick={() => navigateTo(navigate, "/storage")}
              className={style.container__header__button_botao_back}
            >
              Voltar
            </button>
          </div>
        </div>

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
              value={filters.productName}
              onChange={(e) =>
                setFilters({ ...filters, productName: e.target.value })
              }
              className={style.filtros__produto__input}
            />
          </div>

          <div className={style.filtros__tipo}>
            <label htmlFor="movement-type">Tipo</label>
            <select
              id="movement-type"
              value={filters.movementType}
              onChange={(e) =>
                setFilters({ ...filters, movementType: e.target.value })
              }
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
            <tbody>
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
                  <tr key={entry.id} id={`movement-${entry.id}`}>
                    <td>{entry.productName}</td>
                    <td>{entry.categoryName}</td>
                    <td>{entry.employeeName}</td>
                    <td>{entry.type}</td>
                    <td>{Math.abs(entry.quantity)}</td>
                    <td>Lote #{entry.batchId ?? ""}</td>
                    <td>R$ {entry.unitPrice.toFixed(2)}</td>
                    <td>{registeredAt}</td>
                    <td style={{ color }}>{expiresAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import Modal from "../modal/modal";
import ProductForm from "../form/product/productForm";
import CategoryForm from "../form/category/categoryForm";
import MovementForm from "../form/movement/formMovement";
import { useNavigate } from "react-router";
import style from "./Storage.module.scss";
import { navigateTo } from "~/utils/navigateTo";

export function Storage() {
  const BASE_URL = "https://backend-production-cec8.up.railway.app";

  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalType, setModalType] = useState<
    "product" | "category" | "movement" | null
  >(null);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const openModal = (type: "product" | "category" | "movement", data?: any) => {
    setModalType(type);
    setModalData(data || null);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  const loadProducts = async () => {
    const response = await fetch(`${BASE_URL}/product`);
    const data = await response.json();
    setProducts(data || []);
  };

  const loadCategories = async () => {
    const response = await fetch(`${BASE_URL}/category`);
    const data = await response.json();
    setCategories(data || []);
  };

  const createProduct = async (item: any): Promise<any> => {
    const response = await fetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await loadProducts();
    return response.json();
  };

  const updateProduct = async (item: any): Promise<any> => {
    const response = await fetch(`${BASE_URL}/product/${item.productID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await loadProducts();
    return response.json();
  };

  const createCategory = async (item: any) => {
    await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    loadCategories();
  };

  const createMovement = async (item: any) => {
    await fetch(`${BASE_URL}/movements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    loadProducts();
  };

  const Logout = (href: string) => {
    window.localStorage.removeItem("token");
    window.location.href = href;
  };

  return (
    <div className={style.container}>
      <div className={style.container__header}>
        <img
          src="../image/stokeeper_logo.png"
          alt="StoKeeper Logo"
          className={style.container__header__logo}
          loading="lazy"
          draggable="false"
        />
        <div className={style.container__header__buttons}>
          <button
            className={style.container__header__buttons_button}
            onClick={() => navigateTo(navigate, "/stockrupture")}
          >
            Quebras
          </button>
          <button
            className={style.container__header__buttons_button}
            onClick={() => navigateTo(navigate, "/movements")}
          >
            Movimentações
          </button>
          <button
            className={style.container__header__buttons_button}
            id="login"
            onClick={() => navigateTo(navigate, "/employee")}
          >
            Funcionários
          </button>
          <button
            className={style.container__header__buttons_button_logout}
            onClick={() => Logout(window.location.origin)}
          >
            Sair
          </button>
        </div>
      </div>

      <div className={style.conteudo}>
        <h2 className={style.conteudo__titulo}>Gerenciamento de Estoque</h2>
        <div className={style.conteudo__buttons}>
          <button
            className={style.conteudo__buttons_new}
            onClick={() => openModal("product")}
          >
            Cadastrar Produto
          </button>

          <button
            className={style.conteudo__buttons_new}
            onClick={() => openModal("category")}
          >
            Cadastrar Categoria
          </button>
        </div>
      </div>

      <div className={style.div_table}>
        <table className={style.div_table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Valor Unitário (Média)</th>
              <th className="acao">Entrada</th>
              <th className="acao">Saida</th>
            </tr>
          </thead>
          <tbody className={style.tabela}>
            {products.map((item, index) => (
              <tr key={item.id} className={style.tabela__linha}>
                <td className={style.tabela__linha__dados}>
                  <div>
                    {item.name}
                    <button onClick={() => openModal("product", item)}>
                      <i className="ri-edit-box-line" />
                    </button>
                  </div>
                </td>

                <td className={style.tabela__linha__dados}>
                  {item.description}
                </td>

                <td className={style.tabela__linha__categoria}>
                  {item.categoryName}
                </td>

                <td className={style.tabela__linha__quantidade}>
                  {item.quantity}
                </td>

                <td className={style.tabela__linha__valor}>
                  R$ {item.averageUnitPrice?.toFixed(2)}
                </td>

                <td className={style.tabela__linha__acao}>
                  <button
                    onClick={() =>
                      openModal("movement", { type: "entrada", index })
                    }
                    className={style.tabela__linha__acao__botao_add}
                  >
                    <i className="ri-add-box-fill" />
                  </button>
                </td>

                <td className={style.tabela__linha__acao}>
                  <button
                    onClick={() =>
                      openModal("movement", { type: "saida", index })
                    }
                    className={style.tabela__linha__acao__botao_remove}
                  >
                    <i className="ri-checkbox-indeterminate-fill" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal
        title="Novo Produto"
        isOpen={modalType === "product"}
        onClose={closeModal}
      >
        <ProductForm
          product={modalData}
          categories={categories}
          onSave={modalData ? updateProduct : createProduct}
          onClose={closeModal}
        />
      </Modal>

      <Modal
        title="Nova Categoria"
        isOpen={modalType === "category"}
        onClose={closeModal}
      >
        <CategoryForm onSave={createCategory} onClose={closeModal} />
      </Modal>

      <Modal
        title="Nova Movimentação"
        isOpen={modalType === "movement"}
        onClose={closeModal}
      >
        <MovementForm
          product={products[modalData?.index]}
          onSave={createMovement}
        />
      </Modal>
    </div>
  );
}

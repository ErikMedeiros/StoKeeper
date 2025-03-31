import Modal from "../modal/modal";
import { useState } from "react";
import style from "./Storage.module.scss";
import ProductForm from "../form/product/productForm";
import CategoryForm from "../form/category/categoryForm";
import MovementForm from "../form/movement/formMovement";

export function Storage() {
  const [modalType, setModalType] = useState<
    "product" | "category" | "movement" | null
  >(null);

  const openModal = (type: "product" | "category" | "movement") =>
    setModalType(type);
  const closeModal = () => setModalType(null);

  function Logout(href: string) {
    window.localStorage.removeItem("token");
    window.location.href = href;
  }

  return (
    <>
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
            <button className={style.container__header__buttons_button}>
              Quebras
            </button>

            <button className={style.container__header__buttons_button}>
              Movimentações
            </button>

            <button
              className={style.container__header__buttons_button}
              id="login"
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
            <tbody></tbody>
          </table>
        </div>

        {/* Modal de Produto */}
        <Modal
          title="Novo Produto"
          isOpen={modalType === "product"}
          onClose={closeModal}
        >
          <ProductForm />
        </Modal>

        {/* Modal de Categoria */}
        <Modal
          title="Nova Categoria"
          isOpen={modalType === "category"}
          onClose={closeModal}
        >
          <CategoryForm />
        </Modal>

        {/* Modal de Movimentação */}
        <Modal
          title="Nova Movimentação"
          isOpen={modalType === "movement"}
          onClose={closeModal}
        >
          <MovementForm />
        </Modal>
      </div>
    </>
  );
}

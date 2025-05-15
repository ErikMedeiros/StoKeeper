import { useEffect, useState } from "react";
import * as backend from "../../backend";
import CategoryForm from "../form/category/categoryForm";
import MovementForm from "../form/movement/formMovement";
import ProductForm from "../form/product/productForm";
import Modal from "../modal/modal";
import style from "./Storage.module.scss";

type ModalType = "product" | "category" | "movement";

export function Storage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  async function createProduct(item: unknown) {
    await backend.createProduct(item);
    setProducts(await backend.getProducts());
  }

  async function updateProduct(item: unknown) {
    await backend.updateProduct(item);
    setProducts(await backend.getProducts());
  }

  async function createCategory(item: unknown) {
    await backend.createCategory(item);
    setCategories(await backend.getCategories());
  }

  async function createMovement(item: unknown) {
    await backend.createMovement(item);
    setProducts(await backend.getProducts());
    closeModal();
  }

  useEffect(() => {
    backend.getProducts().then(setProducts);
    backend.getCategories().then(setCategories);
  }, []);

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data || null);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <div>
      <div className={style.conteudo}>
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
                    disabled={item.quantity == 0}
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
          movementType={modalData?.type}
        />
      </Modal>
    </div>
  );
}

import { useEffect, useState } from "react";
import style from "./ProductForm.module.scss";

interface Category {
  id: string;
  name: string;
}

interface Props {
  product?: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    notifyBeforeExpiresDays: number;
  };
  categories?: Category[];
  onSave: (item: any) => Promise<void>;
  onClose?: () => void;
}

export default function ProductForm({
  product,
  categories = [],
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [notifyBeforeExpiresDays, setNotifyBeforeExpiresDays] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategoryId(product.categoryId);
      setNotifyBeforeExpiresDays(product.notifyBeforeExpiresDays);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const item = {
      productID: product?.id,
      name,
      description,
      categoryId,
      notifyBeforeExpiresDays,
    };

    try {
      await onSave(item);
      onClose?.();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <label htmlFor="product-name" className={style.form__label}>
        Produto
      </label>
      <input
        id="product-name"
        name="product-name"
        type="text"
        className={style.form__input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="description" className={style.form__label}>
        Descrição
      </label>
      <input
        id="description"
        name="description"
        type="text"
        className={style.form__input}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label htmlFor="category-id" className={style.form__label}>
        Categoria
      </label>
      <select
        id="category-id"
        name="category-id"
        className={style.form__input}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className={style.form__checkbox}>
        <input
          type="checkbox"
          id="is-expirable"
          className={style.form__checkbox__input}
          checked={notifyBeforeExpiresDays!== null}
          onChange={(e) => setNotifyBeforeExpiresDays(e.target.checked ? 5 : null)}
        />
        <label htmlFor="is-expirable" className={style.form__checkbox__label}>
          Perecível
        </label>
      </div>

      {notifyBeforeExpiresDays !== null && (
        <div className={style.form__number}>
          <label htmlFor="notify" className={style.form__number__label}>
            Aviso antes de vencer (dias)
          </label>
          <input
            type="number"
            id="notify"
            className={style.form__number__input}
            value={notifyBeforeExpiresDays || ''}
            onChange={(e) => setNotifyBeforeExpiresDays(Number(e.target.value))}
          />
        </div>
      )}

      <button type="submit" className={style.form__button}>
        Salvar
      </button>
    </form>
  );
}

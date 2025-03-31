import { useState } from "react";
import style from "./ProductForm.module.scss";

interface Props {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProductForm({ onSubmit }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={style.form}>
        <label htmlFor="product-name" className={style.form__label}>
          Produto
        </label>
        <input
          id="product-name"
          name="product-name"
          type="text"
          className={style.form__input}
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
          required
        />

        <label htmlFor="category-id" className={style.form__label}>
          Categoria
        </label>
        <select
          id="category-id"
          name="category-id"
          className={style.form__input}
          required
        ></select>

        <div className={style.form__checkbox}>
          <input
            type="checkbox"
            id="is-expirable"
            className={style.form__checkbox__input}
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
            }}
          />
          <label htmlFor="is-expirable" className={style.form__checkbox__label}>
            Perecível
          </label>
        </div>

        {isChecked && (
          <div className={style.form__number}>
            <label htmlFor="notify" className={style.form__number__label}>
              Aviso antes de vencer (dias)
            </label>
            <input
              type="number"
              id="notify"
              className={style.form__number__input}
            />
          </div>
        )}

        <button className={style.form__button}>Salvar</button>
      </form>
    </>
  );
}

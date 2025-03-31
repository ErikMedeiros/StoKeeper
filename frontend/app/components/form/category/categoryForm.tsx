import style from "./CategoryForm.module.scss";

interface Props {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CategoryForm({ onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={style.form}>
        <label htmlFor="category-name" className={style.form__label}>
          Nome
        </label>
        <input
          id="category-name"
          name="category-name"
          type="text"
          className={style.form__input}
          required
        />
        <button className={style.form__button}>Salvar</button>
      </form>
    </>
  );
}

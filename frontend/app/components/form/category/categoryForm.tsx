import style from "./CategoryForm.module.scss";

interface Props {
  onSave: (item: any) => Promise<void>;
  onClose?: () => void;
}

export default function CategoryForm({ onSave, onClose }: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const item = {
      name: form["category-name"].value,
    };

    await onSave(item);
    onClose?.();
  };

  return (
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
      <button type="submit" className={style.form__button}>
        Salvar
      </button>
    </form>
  );
}

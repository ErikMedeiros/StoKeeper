import style from "./FormMovement.module.scss";

interface Props {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function MovementForm({ onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={style.form}>
        <label htmlFor="quantity" className={style.form__label}>
          Quantidade
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          className={style.form__input}
          required
        />

        <label htmlFor="unit-price" className={style.form__label}>
          Valor Unitário
        </label>
        <input
          id="unit-price"
          name="unit-price"
          type="number"
          className={style.form__input}
          required
        />

        <fieldset>
          <legend>Tipo da movimentação</legend>
          <div>
            <input type="radio" name="movement" value="entrada" checked />
            <label>Entrada</label>
          </div>
          <div>
            <input type="radio" name="movement" value="saida" disabled />
            <label>Saída</label>
          </div>
        </fieldset>

        <div id="expires-at-container">
          <label htmlFor="expires-at">Data de Validade</label>
          <input type="date" id="expires-at" />
        </div>

        <button>Salvar</button>
      </form>
    </>
  );
}

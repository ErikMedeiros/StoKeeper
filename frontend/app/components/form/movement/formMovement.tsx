import style from "./FormMovement.module.scss";

interface Props {
  product: any;
  onSave: (item: any) => Promise<void>;
}

export default function MovementForm({ product, onSave }: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const item = {
      quantity: form["quantity"].value,
      unitPrice: form["unit-price"].value,
      movement: form["movement"].value,
      expiresAt: form["expires-at"].value,
    };

    await onSave(item);
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
          <input type="date" id="expires-at" name="expires-at" />
        </div>

        <button>Salvar</button>
      </form>
    </>
  );
}

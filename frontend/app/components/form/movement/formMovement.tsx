import { useState } from "react";
import style from "./FormMovement.module.scss";

interface Props {
  product: any;
  onSave: (item: any) => Promise<void>;
  movementType: "entrada" | "saida";
}

export default function MovementForm({ product, onSave, movementType }: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const item = {
      productId: product.id,
      employeeId: +window.localStorage.getItem("token")!,
      quantity: form["quantity"].valueAsNumber,
      unitPrice: form["unit-price"].valueAsNumber,
      type: movementType,
      batchId: form["batch-id"].value,
      expiresAt: null,
    };

    if (movementType === "entrada" && product.notifyBeforeExpiresDays !== null) {
      item.expiresAt = form["expires-at"]?.value ?? null;
    }

    await onSave(item);
  };

  const existingBatches = product?.batches || [];
  const [newBatch, setNewBatch] = useState(movementType === "entrada");

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

        <fieldset className={style.form__fieldset}>
          <legend className={style.form__fieldset__legend}>
            Tipo da movimentação
          </legend>
          <div className={style.form__fieldset__div}>
            <input
              type="radio"
              name="movement"
              value="entrada"
              checked={movementType === "entrada"}
              readOnly
            />
            <label>Entrada</label>
          </div>
          <div className={style.form__fieldset__div}>
            <input
              type="radio"
              name="movement"
              value="saida"
              checked={movementType === "saida"}
              readOnly
            />
            <label>Saída</label>
          </div>
        </fieldset>

        {movementType === "entrada" && product.notifyBeforeExpiresDays !== null && (
          <>
            <label htmlFor="expires-at" className={style.form__label}>
              Data de Validade
            </label>
            <input
              type="date"
              id="expires-at"
              name="expires-at"
              className={style.form__input}
            />
          </>
        )}

        <div className={style.form__lote}>
          <div>
            <label htmlFor="batch-id" className={style.form__lote__label}>
              Lotes
            </label>
            <select
              id={newBatch ? undefined : "batch-id"}
              name={newBatch ? undefined : "batch-id"}
              className={style.form__lote__input}
              required
              onChange={(e) => setNewBatch(e.target.value === "novo")}
            >
              {movementType === "entrada" && (
                <option value="novo">Novo Lote</option>
              )}
              {existingBatches.map((batch: any) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name || `Lote #${batch.id}`}
                  {batch.expiresAt &&
                    ` - ${new Date(batch.expiresAt).toLocaleDateString()}`}
                </option>
              ))}
            </select>

            {newBatch && (
              <input
                type="text"
                name="batch-id"
                id="batch-id"
                style={{ marginTop: "8px" }}
                className={style.form__input}
              />
            )}
          </div>
        </div>

        <button className={style.form__button}>Salvar</button>
      </form>
    </>
  );
}

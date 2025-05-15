import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import * as backend from "../../backend";
import style from "../../components/stockrupture/Stockrupture.module.scss";
import type { Route } from "../private/+types/stockrupture";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Inventário" }];
}

export default function StockRupture(props: Route.ComponentProps) {
  const { products } = props.loaderData;

  const [productIndex, setProductIndex] = useState(0);
  const [batchId, setBatchId] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = +event.currentTarget.quantidade.value;
    const comment: string = event.currentTarget.comentario.value;
    const unitPrice: number = +event.currentTarget.unitPrice.value;
    const expiresAtRaw: string = event.currentTarget["expires-at"]?.value;
    const expiresAt = expiresAtRaw ? `${expiresAtRaw}T00:00:00-03:00` : null;

    setEntries((prev) => {
      const output = [...prev];
      const index = output.findIndex(
        (e) => e.productIndex === productIndex && e.batchId === batchId
      );

      if (index !== -1) {
        output[index].quantity = quantity;
        output[index].comment = comment;
        output[index].expiresAt = expiresAt;
        output[index].unitPrice = unitPrice;
      } else {
        output.push({
          productIndex,
          batchId,
          unitPrice,
          expiresAt,
          quantity,
          comment,
        });
      }

      return output;
    });

    event.currentTarget.reset();
    setBatchId("");
  }

  async function submit() {
    try {
      const employeeId = +window.localStorage.getItem("token")!;
      const data = entries.map((p) => ({
        productId: products[p.productIndex].id,
        batchId: p.batchId,
        quantity: p.quantity,
        expiresAt: p.expiresAt,
        unitPrice: p.unitPrice,
        comment: p.comment,
      }));

      setLoading(true);
      await backend.postStockRupture(employeeId, data);
      alert("Inventário atualizado com sucesso");
      setEntries([]);
    } catch (error) {
      alert("Erro ao atualizar o inventário");
    } finally {
      setLoading(false);
    }
  }

  const isNewBatch =
    products[productIndex].batches?.every((b: any) => b.id !== batchId) ?? true;

  return (
    <>
      <div className={style.corpo}>
        <form
          onSubmit={handleOnSubmit}
          className="h-full border-2 border-gray-300 rounded-sm p-4 flex flex-col gap-2"
        >
          <label htmlFor="produto">Produto</label>
          <select
            id="produto"
            required
            value={productIndex}
            onChange={(e) => {
              setProductIndex(+e.target.value);
              setBatchId("");
            }}
          >
            {products.map((product: any, index: number) => (
              <option key={product.id} value={index}>
                {product.name}
              </option>
            ))}
          </select>

          <label htmlFor="lote">
            Lote <span className="text-red-500">*</span>
          </label>
          <select
            id={isNewBatch ? undefined : "lote"}
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          >
            <option value="">Novo Lote</option>

            {(products[productIndex].batches ?? []).map((batch: any) => {
              const expiresAt =
                (batch.expiresAt &&
                  ` - ${new Date(batch.expiresAt).toLocaleDateString()}`) ??
                "";
              return (
                <option key={batch.id} value={batch.id}>
                  Lote #{batch.id} {expiresAt}
                </option>
              );
            })}
          </select>
          {isNewBatch && (
            <input
              type="text"
              id={isNewBatch ? "lote" : undefined}
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
            />
          )}

          {products[productIndex].notifyBeforeExpiresDays !== null &&
            isNewBatch && (
              <>
                <label htmlFor="expires-at">Data de Validade</label>
                <input type="date" id="expires-at" name="expires-at" required />
              </>
            )}

          <label htmlFor="quantidade">Quantidade</label>
          <input type="number" name="quantidade" id="quantidade" required />

          <label htmlFor="unit-price">Valor Unitário</label>
          <input type="number" name="unitPrice" id="unitPrice" required />

          <label htmlFor="comentario">Comentário</label>
          <textarea
            name="comentario"
            id="comentario"
            className="p-2 border-[1px] border-[#ccc] rounded-sm"
          ></textarea>

          <button type="submit" disabled={loading}>
            Adicionar
          </button>
        </form>

        <div className="h-full flex flex-col gap-2 overflow-x-hidden">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Lote</th>
                  <th>Quantidade</th>
                  <th>Diferença</th>
                  <th>Comentário</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry) => {
                  const product = products[entry.productIndex];
                  const batch = product.batches?.find(
                    (b: any) => b.id === entry.batchId
                  );

                  let expiresAt = "";
                  if (batch?.expiresAt) {
                    const date = new Date(batch.expiresAt).toLocaleDateString();
                    expiresAt = ` - ${date}`;
                  } else if (entry.expiresAt) {
                    const date = new Date(entry.expiresAt).toLocaleDateString();
                    expiresAt = ` - ${date}`;
                  }

                  return (
                    <tr key={`${product.id}_${entry.batchId}`}>
                      <td>{product.name}</td>
                      <td>
                        Lote #{entry.batchId} {expiresAt}
                      </td>
                      <td>{entry.quantity}</td>
                      <td>{entry.quantity - (batch?.quantity ?? 0)}</td>
                      <td>{entry.comment || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button className="mt-auto" disabled={loading} onClick={submit}>
            Salvar
          </button>
        </div>
      </div>
    </>
  );
}

export async function loader(args: LoaderFunctionArgs) {
  const products = await backend.getProducts();
  return { products };
}

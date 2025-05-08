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
  const [batchIndex, setBatchIndex] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = +event.currentTarget.quantidade.value;
    const comment: string = event.currentTarget.comentario.value;

    setEntries((prev) => {
      const output = [...prev];
      const index = output.findIndex(
        (e) => e.productIndex === productIndex && e.batchIndex === batchIndex
      );

      if (index !== -1) {
        output[index].quantity = quantity;
        output[index].comment = comment;
      } else {
        output.push({ productIndex, batchIndex, quantity, comment });
      }

      return output;
    });
  }

  return (
    <>
      <div className={style.corpo}>
        <form className="h-full" onSubmit={handleOnSubmit}>
          <label htmlFor="produto">Produto</label>
          <select
            id="produto"
            required
            value={productIndex}
            onChange={(e) => {
              setProductIndex(+e.target.value);
              setBatchIndex(-1);
            }}
          >
            {products.map((product: any, index: number) => (
              <option key={product.id} value={index}>
                {product.name}
              </option>
            ))}
          </select>

          <label htmlFor="lote">Lote</label>
          <select
            id="lote"
            value={batchIndex}
            onChange={(e) => setBatchIndex(+e.target.value)}
          >
            <option value="-1">Novo Lote</option>

            {(products[productIndex].batches ?? []).map(
              (batch: any, index: number) => (
                <option key={batch.id} value={index}>
                  Lote #{batch.id}
                </option>
              )
            )}
          </select>

          <label htmlFor="quantidade">Quantidade</label>
          <input type="number" name="quantidade" id="quantidade" required />

          <label htmlFor="comentario">Comentário</label>
          <textarea
            name="comentario"
            id="comentario"
            className="p-2 border-[1px] border-[#ccc] rounded-sm"
          ></textarea>

          <button type="submit">Registrar Quebra</button>
        </form>

        <div>
          <div>
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
                  const batch = product.batches?.[entry.batchIndex];

                  return (
                    <tr key={`${product.id}_${batch.id}`}>
                      <td>{product.name}</td>
                      <td>Lote #{batch.id}</td>
                      <td>{entry.quantity}</td>
                      <td>{entry.quantity - batch.quantity}</td>
                      <td>{entry.comment || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button type="submit">Salvar</button>
        </div>
      </div>
    </>
  );
}

export async function loader(args: LoaderFunctionArgs) {
  const products = await backend.getProducts();
  return { products };
}

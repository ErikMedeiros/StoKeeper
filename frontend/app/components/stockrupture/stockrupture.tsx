import style from "./Stockrupture.module.scss";

export function StockRupture() {
  return (
    <>
      <div className={style.corpo}>
        <form id="formQuebra">
          <label htmlFor="produto">Produto</label>
          <select id="produto" required>
            <option value="" selected>
              Selecione o Produto
            </option>
          </select>

          <label htmlFor="lote">Lote</label>
          <select id="lote">
            <option value="" selected>
              Novo Lote
            </option>
          </select>

          <label htmlFor="quantidade">Quantidade</label>
          <input type="number" id="quantidade" required />

          <label htmlFor="comentario">Comentário</label>
          <textarea id="comentario"></textarea>

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

              <tbody></tbody>
            </table>
          </div>

          <button type="submit">Salvar</button>
        </div>
      </div>
    </>
  );
}

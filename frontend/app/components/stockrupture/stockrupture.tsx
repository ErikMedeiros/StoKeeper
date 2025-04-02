import { useNavigate } from "react-router";
import style from "./Stockrupture.module.scss";

export function StockRupture() {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.container__header}>
          <img
            src="../image/stokeeper_logo.png"
            alt="StoKeeper Logo"
            loading="lazy"
            draggable="false"
            className={style.container__header__imagem}
          />

          <h1 className={style.container__header__titulo}>
            Registro de Quebra de Estoque
          </h1>

          <button
            className={style.container__header__button}
            onClick={() => navigateTo("/storage")}
          >
            Sair
          </button>
        </div>
      </div>

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

import style from "./Storage.module.scss";

export function Storage() {
  return (
    <>
      <div className={style.container}>
        <div className={style.container__header}>
          <img
            src="../image/stokeeper_logo.png"
            alt="StoKeeper Logo"
            className={style.container__header__logo}
            loading="lazy"
            draggable="false"
          />

          <div className={style.container__header__buttons}>
            <button className={style.container__header__buttons_button}>
              Quebras
            </button>

            <button className={style.container__header__buttons_button}>
              Movimentações
            </button>

            <button
              className={style.container__header__buttons_button}
              id="login"
            >
              Funcionários
            </button>

            <button className={style.container__header__buttons_button_logout}>
              Sair
            </button>
          </div>
        </div>

        <div className={style.conteudo}>
          <h2 className={style.conteudo__titulo}>Gerenciamento de Estoque</h2>
          <div className={style.conteudo__buttons}>
            <button className={style.conteudo__buttons_new}>
              Cadastrar Produto
            </button>

            <button className={style.conteudo__buttons_new}>
              Cadastrar Categoria
            </button>
          </div>
        </div>

        <div className={style.div_table}>
          <table className={style.div_table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Valor Unitário (Média)</th>
                <th className="acao">Entrada</th>
                <th className="acao">Saida</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <div id="product-modal" className="modal-container">
          <div className="modal">
            <form>
              <label htmlFor="product-name">Produto</label>
              <input id="product-name" type="text" required />

              <label htmlFor="description">Descrição</label>
              <input id="description" type="text" required />

              <label htmlFor="category-id">Categoria</label>

              <select id="category-id" required></select>

              <input type="checkbox" id="is-expirable" />
              <label htmlFor="is-expirable">Perecível</label>

              <div>
                <label htmlFor="notify">Aviso antes de vencer (dias)</label>
                <input type="number" id="notify" />
              </div>

              <button id="salvar-produto">Salvar</button>
            </form>
          </div>
        </div>

        <div id="category-modal" className="modal-container">
          <div className="modal">
            <form>
              <label htmlFor="category-name">Nome</label>
              <input id="category-name" type="text" required />
              <button id="salvar-categoria">Salvar</button>
            </form>
          </div>
        </div>

        <div id="movement-modal" className="modal-container">
          <div className="modal">
            <form>
              <label htmlFor="quantity">Quantidade</label>
              <input id="quantity" type="number" required />

              <label htmlFor="unit-price">Valor Unitário</label>
              <input id="unit-price" type="number" required />

              <fieldset>
                <legend>Tipo da movimentação</legend>
                <div>
                  <input type="radio" name="movement" value="entrada" checked />
                  <label htmlFor="huey">Entrada</label>
                </div>

                <div>
                  <input type="radio" name="movement" value="saida" disabled />
                  <label htmlFor="dewey">Saída</label>
                </div>
              </fieldset>

              <br />

              <div id="expires-at-container">
                <label htmlFor="expires-at">Data de Validade</label>
                <input type="date" id="expires-at" />
              </div>

              <div>
                <div>
                  <label htmlFor="batch-id">Lotes</label>
                  <br />
                  <select id="batch-id"></select>
                </div>

                <div id="new-batch-container">
                  <label htmlFor="new-batch-id">Código do Lote</label>
                  <input type="text" id="new-batch-id" />
                </div>
              </div>

              <button id="salvar-movimentacao">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

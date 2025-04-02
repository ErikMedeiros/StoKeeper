import { navigateTo } from "~/utils/navigateTo";
import style from "./Caduser.module.scss";
import { useNavigate } from "react-router";

export function CadUser() {
  const navigate = useNavigate();

  const Logout = (href: string) => {
    window.localStorage.removeItem("token");
    window.location.href = href;
  };

  const handleLoginRedirect = () => {
    Logout(window.location.origin);
    navigateTo(navigate, "/");
  };
  return (
    <>
      <div className={style.register__container}>
        <img
          src="../image/stokeeper_logo.png"
          alt="Logo StoKeeper"
          loading="lazy"
          draggable="false"
          className={style.register__container__logo}
        />
        <h2 className={style.register__container__titulo}>
          Cadastro de Usuário
        </h2>

        <form className={style.register__container__form}>
          <label
            className={style.register__container__form__label}
            htmlFor="newUsername"
          >
            Novo Usuário
          </label>
          <input
            className={style.register__container__form__input}
            type="text"
            id="newUsername"
            required
          />

          <label
            className={style.register__container__form__label}
            htmlFor="newPassword"
          >
            Senha
          </label>
          <input
            className={style.register__container__form__input}
            type="password"
            id="newPassword"
            required
          />

          <div className={style.register__container__form__admin}>
            <input
              className={style.register__container__form__admin__input}
              type="checkbox"
              id="isAdmin"
            />
            <label
              className={style.register__container__form__admin__label}
              htmlFor="isAdmin"
            >
              Admin
            </label>
          </div>

          <button
            type="button"
            className={style.register__container__form__button}
            //   onclick="registerUser()"
          >
            <span className="text">Cadastrar</span>
          </button>
        </form>
        <p className={style.register__container__paragrafo}>
          Já tem uma conta?{" "}
          <span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLoginRedirect();
              }}
            >
              Faça login
            </a>
          </span>
        </p>
      </div>
    </>
  );
}

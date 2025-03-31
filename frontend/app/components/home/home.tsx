import { useEffect, useState } from "react";
import style from "./Home.module.scss";
import { useNavigate } from "react-router";

export function Home() {
  const BASE_URL = "https://backend-production-cec8.up.railway.app";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/storage");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/employee/login?username=${username}&password=${password}`
      );
      const data = await response.json();

      if (data.userId) {
        alert("Login bem-sucedido!");
        localStorage.setItem("token", data.userId.toString());
        navigate("/storage");
      } else {
        alert("Credenciais incorretas");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <>
      <div className={style.login__container}>
        <img
          src="../image/stokeeper_logo.png"
          alt="Logo StoKeeper"
          loading="lazy"
          draggable="false"
          className={style.login__container__logo}
        />
        <h2 className={style.login__container__titulo}>Login</h2>
        <form
          id="loginForm"
          className={style.login__container__form}
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="username"
            className={style.login__container__form__label}
          >
            <i className="ri-user-line" />
            Usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={style.login__container__form__input}
            placeholder="Insira seu usuário"
          />

          <label
            htmlFor="password"
            className={style.login__container__form__label}
          >
            <i className="ri-lock-2-line" />
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            required
            className={style.login__container__form__input}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira sua senha"
          />

          <button
            type="submit"
            className={style.login__container__form__button}
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}

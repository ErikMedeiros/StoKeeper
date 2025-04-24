import type { FormEvent } from "react";
import style from "./create.module.scss";

export interface Employee {
  username: string;
  password: string;
  isAdmin: boolean;
  name: string;
  position: string;
  salary: number;
}

interface EmployeeFormProps {
  onSave: (employee: Employee) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateEmployeeForm({
  onSave,
  isLoading = false,
}: EmployeeFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const employee: Employee = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
      isAdmin: event.currentTarget.isAdmin.checked,
      name: event.currentTarget._name.value,
      position: event.currentTarget.position.value,
      salary: event.currentTarget.salary.valueAsNumber,
    };

    onSave(employee);
  }

  return (
    <form className={style.register__container__form} onSubmit={handleSubmit}>
      <label
        className={style.register__container__form__label}
        htmlFor="newUsername"
      >
        Usuário
      </label>
      <input
        className={style.register__container__form__input}
        type="text"
        id="newUsername"
        name="username"
        required
        disabled={isLoading}
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
        name="password"
        required
        disabled={isLoading}
      />

      <label className={style.register__container__form__label} htmlFor="_name">
        Nome
      </label>
      <input
        className={style.register__container__form__input}
        type="text"
        id="_name"
        name="_name"
        required
        disabled={isLoading}
      />

      <label
        className={style.register__container__form__label}
        htmlFor="position"
      >
        Cargo
      </label>
      <input
        className={style.register__container__form__input}
        type="text"
        id="position"
        name="position"
        required
        disabled={isLoading}
      />

      <label
        className={style.register__container__form__label}
        htmlFor="salary"
      >
        Salário
      </label>
      <input
        className={style.register__container__form__input}
        type="number"
        id="salary"
        name="salary"
        required
        disabled={isLoading}
      />

      <div className={style.register__container__form__admin}>
        <input
          className={style.register__container__form__admin__input}
          type="checkbox"
          id="isAdmin"
          name="isAdmin"
          disabled={isLoading}
        />
        <label
          className={style.register__container__form__admin__label}
          htmlFor="isAdmin"
        >
          Admin
        </label>
      </div>

      <button
        type="submit"
        className={style.register__container__form__button}
        disabled={isLoading}
      >
        <span className="text">Cadastrar</span>
      </button>
    </form>
  );
}

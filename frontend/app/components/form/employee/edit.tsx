import { useState, useEffect } from "react";
import style from "./edit.module.scss";

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  isAdmin: boolean;
}

interface EmployeeFormProps {
  employee: Employee;
  onSave: (data: Employee) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditEmployeeForm({
  employee,
  onSave,
  onCancel,
  isLoading = false,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: employee.name,
    position: employee.position,
    salary: employee.salary.toString(),
    isAdmin: employee.isAdmin,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: employee.name,
      position: employee.position,
      salary: employee.salary.toString(),
      isAdmin: employee.isAdmin,
    });
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    const fieldName = id.replace("m-", "");

    setFormData((prev) => ({
      ...prev,
      [fieldName]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("O nome é obrigatório");
      return false;
    }
    if (!formData.position.trim()) {
      setError("A função é obrigatória");
      return false;
    }
    const salaryValue = Number(formData.salary);
    if (isNaN(salaryValue) || salaryValue <= 0) {
      setError("O salário deve ser um número válido e maior que zero");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedEmployee: Employee = {
      ...employee,
      name: formData.name.trim(),
      position: formData.position.trim(),
      salary: Number(formData.salary),
      isAdmin: formData.isAdmin,
    };

    await onSave(updatedEmployee);
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      {error && <div className={style.errorMessage}>{error}</div>}

      <label htmlFor="m-name" className={style.form__label}>
        Nome
      </label>
      <input
        id="m-name"
        type="text"
        className={style.form__input}
        value={formData.name}
        onChange={handleInputChange}
        disabled={isLoading}
      />

      <label htmlFor="m-position" className={style.label}>
        Função
      </label>
      <input
        id="m-position"
        type="text"
        className={style.form__input}
        value={formData.position}
        onChange={handleInputChange}
        disabled={isLoading}
      />

      <label htmlFor="m-salary" className={style.form__label}>
        Salário (R$)
      </label>
      <input
        id="m-salary"
        type="number"
        className={style.form__input}
        value={formData.salary}
        onChange={handleInputChange}
        disabled={isLoading}
        min="0"
        step="0.01"
      />

      <div className={style.form__checkbox}>
        <input
          id="m-isAdmin"
          type="checkbox"
          className={style.form__checkbox_label_box}
          checked={formData.isAdmin}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <label htmlFor="m-isAdmin" className={style.form__checkbox_label}>
          Administrador
        </label>
      </div>

      <div className={style.form__button}>
        <button
          type="submit"
          className={style.form__button__botao_salvar}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <button
          type="button"
          className={style.form__button__botao_cancelar}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

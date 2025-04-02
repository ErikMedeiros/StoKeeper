import { useEffect, useState } from "react";
import { navigateTo } from "~/utils/navigateTo";
import style from "./Employee.module.scss";
import { useNavigate } from "react-router";
import Modal from "../modal/modal";
import EmployeeForm from "../form/employee/employeeForm";

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  isAdmin: boolean;
}

const BASE_URL = "https://backend-production-cec8.up.railway.app";

export function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const result = await fetch(`${BASE_URL}/employee`);
      const data = await result.json();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/employee/${updatedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });
      await loadEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          Gerenciamento de Funcionários
        </h1>

        <div className={style.container__header__button}>
          <button
            onClick={() => navigateTo(navigate, "/cadastro-user")}
            className={style.container__header__button_botao}
          >
            Cadastrar Funcionário
          </button>
          <button
            onClick={() => navigateTo(navigate, "/storage")}
            className={style.container__header__button_botao_back}
          >
            Voltar
          </button>
        </div>
      </div>

      <div className={style.div}>
        <table className={style.div__table}>
          <thead className={style.div__table__thead}>
            <tr className={style.div__table__thead_tr}>
              <th className={style.div__table__thead_tr_th}>Nome</th>
              <th className={style.div__table__thead_tr_th}>Função</th>
              <th className={style.div__table__thead_tr_th}>Salário</th>
              <th className={style.div__table__thead_tr_th_acao}>Admin</th>
              <th className={style.div__table__thead_tr_th_acao}>Editar</th>
              <th className={style.div__table__thead_tr_th_acao}>Excluir</th>
            </tr>
          </thead>

          <tbody className={style.tabela}>
            {employees.map((employee) => (
              <tr
                key={`employee-${employee.id}`}
                className={style.tabela__linha}
              >
                <td className={style.tabela__linha__dados}>{employee.name}</td>
                <td className={style.tabela__linha__dados}>
                  {employee.position}
                </td>
                <td className={style.tabela__linha__dados}>
                  R$ {employee.salary.toFixed(2)}
                </td>
                <td className={style.tabela__linha__dados__acao}>
                  {employee.isAdmin ? (
                    <i className="ri-user-follow-line" />
                  ) : (
                    <i className="ri-user-unfollow-line" />
                  )}
                </td>
                <td className={style.tabela__linha__dados__acao}>
                  <button onClick={() => openEditModal(employee)}>
                    <i className="ri-file-edit-line" />
                  </button>
                </td>
                <td className={style.tabela__linha__dados__acao}>
                  <button onClick={() => openEditModal(employee)}>
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentEmployee && (
        <Modal
          title={`Editar ${currentEmployee.name}`}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <EmployeeForm
            employee={currentEmployee}
            onSave={async (updatedEmployee) => {
              await handleSaveEmployee(updatedEmployee);
              closeModal();
            }}
            onCancel={closeModal}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </div>
  );
}

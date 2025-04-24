import { useEffect, useState } from "react";
import * as backend from "../../backend";
import CreateEmployeeForm, {
  type Employee as CreateEmployee,
} from "../form/employee/create";
import EditEmployeeForm from "../form/employee/edit";
import Modal from "../modal/modal";
import style from "./Employee.module.scss";

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  isAdmin: boolean;
}

export function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    backend.getEmployees().then(setEmployees);
    backend.isAdmin(window.localStorage.getItem("token")!).then(setIsAdmin);
  }, []);

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setModalOpen("edit");
  };

  const closeModal = () => {
    setModalOpen(null);
    setCurrentEmployee(null);
  };

  const handleEditEmployee = async (updatedEmployee: Employee) => {
    setIsLoading(true);
    try {
      await backend.updateEmployee(updatedEmployee.id, updatedEmployee);
      setEmployees(await backend.getEmployees());
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (employee: CreateEmployee) => {
    setIsLoading(true);
    try {
      await backend.createEmployee(employee);
      setEmployees(await backend.getEmployees());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="flex flex-row-reverse px-4 pt-4">
          <button
            className="cursor-pointer bg-blue-800 text-white font-bold rounded-md py-2 px-3 transition-transform duration-150 hover:scale-110"
            onClick={() => setModalOpen("create")}
          >
            Cadastrar Funcionário
          </button>
        </div>
      )}

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

      {modalOpen === "edit" && currentEmployee && (
        <Modal
          title={`Editar ${currentEmployee.name}`}
          isOpen={true}
          onClose={closeModal}
        >
          <EditEmployeeForm
            employee={currentEmployee}
            onSave={async (updatedEmployee) => {
              await handleEditEmployee(updatedEmployee);
              closeModal();
            }}
            onCancel={closeModal}
            isLoading={isLoading}
          />
        </Modal>
      )}

      {modalOpen === "create" && (
        <Modal title="Cadastrar Funcionário" isOpen={true} onClose={closeModal}>
          <CreateEmployeeForm
            onSave={async (employee) => {
              await handleCreateEmployee(employee);
              closeModal();
            }}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </>
  );
}

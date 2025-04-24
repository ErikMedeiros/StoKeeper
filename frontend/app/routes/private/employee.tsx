import type { Route } from "../private/+types/storage";
import { Employee } from "../../components/employee/employee";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Gerenciamento de Funcionários" }];
}

export default Employee;

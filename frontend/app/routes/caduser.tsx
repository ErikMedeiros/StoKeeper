import type { Route } from "./+types/storage";
import { CadUser } from "../components/caduser/caduser";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Cadastro de Usuário" }];
}

export default CadUser;

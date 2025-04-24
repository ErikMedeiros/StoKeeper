import type { Route } from "../private/+types/storage";
import { Movements } from "../../components/movements/movements";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Movimentações" }];
}

export default Movements;

import type { Route } from "./+types/home";
import { StockRupture } from "../components/stockrupture/stockrupture";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Quebra de Estoque" }];
}

export default StockRupture;

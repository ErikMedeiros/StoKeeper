import type { Route } from "./+types/home";
import { Home } from "../components/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "StoKeeper" },
    { name: "description", content: "Bem-vindo(a) ao StoKeeper!" },
  ];
}

export default Home;

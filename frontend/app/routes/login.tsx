import type { Route } from "./+types/login";
import { Login } from "../components/login/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "StoKeeper" },
    { name: "description", content: "Bem-vindo(a) ao StoKeeper!" },
  ];
}

export default Login;

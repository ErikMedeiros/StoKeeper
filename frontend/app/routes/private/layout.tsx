import {
  NavLink,
  Outlet,
  redirect,
  useNavigate,
  type ClientLoaderFunction,
} from "react-router";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    window.localStorage.removeItem("token");
    navigate("/");
  }

  const className =
    "bg-gray-100 rounded-md py-2 px-3 [&.active]:bg-blue-800 [&.active]:text-white [&.active]:font-bold transition-transform duration-150 hover:scale-110";

  return (
    <div className="bg-white h-screen max-w-full grid grid-rows-[80px_10fr]">
      <nav className="flex gap-4 justify-between items-center px-7 py-3 border-b-2 border-b-gray-400">
        <img
          src="../image/stokeeper_logo.png"
          alt="StoKeeper Logo"
          className="w-1/7"
          loading="lazy"
          draggable="false"
        />

        <div className="flex gap-4">
          <NavLink to="storage" className={className}>
            Gerenciamento de Estoque
          </NavLink>
          <NavLink to="movements" className={className}>
            Movimentações
          </NavLink>
          <NavLink to="employee" className={className}>
            Funcionários
          </NavLink>
          <NavLink to="stockrupture" className={className}>
            Inventário
          </NavLink>
          <NavLink to="reports" className={className}>
            Relatórios
          </NavLink>

          <button
            className={
              className + "cursor-pointer bg-red-700 text-white font-bold"
            }
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export const clientLoader: ClientLoaderFunction = (ctx) => {
  const token = window.localStorage.getItem("token");
  if (!token) {
    return redirect("/", 307);
  }
};

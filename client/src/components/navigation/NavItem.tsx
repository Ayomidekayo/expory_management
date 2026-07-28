import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  path: string;
  icon: any;
}

export default function NavItem({
  title,
  path,
  icon: Icon,
}: Props) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        transition-all
        ${
          isActive
            ? "bg-emerald-600 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }
      `
      }
    >
      <Icon size={20} />

      <span>{title}</span>
    </NavLink>
  );
}
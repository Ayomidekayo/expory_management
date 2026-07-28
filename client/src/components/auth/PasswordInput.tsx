import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function PasswordInput(
  props: Props
) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-600 outline-none"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-3.5"
      >
        {show ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
}
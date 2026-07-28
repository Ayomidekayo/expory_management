interface Props {
  password: string;
}

export default function PasswordStrength({
  password,
}: Props) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  const width = `${score * 25}%`;

  const color =
    score <= 1
      ? "bg-red-500"
      : score === 2
      ? "bg-yellow-500"
      : score === 3
      ? "bg-blue-500"
      : "bg-green-500";

  return (
    <div className="mt-2">
      <div className="h-2 rounded bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width }}
        />
      </div>

      <p className="text-sm mt-1 text-slate-500">
        {score <= 1
          ? "Weak"
          : score === 2
          ? "Fair"
          : score === 3
          ? "Good"
          : "Strong"}
      </p>
    </div>
  );
}
type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, ...props }: Props) {
  return (
    <div className="w-full">
      <label className="block text-sm text-muted mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 rounded-lg bg-surface text-text border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

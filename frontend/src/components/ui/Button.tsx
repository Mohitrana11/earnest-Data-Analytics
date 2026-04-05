type Props = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-white font-medium"
    >
      {children}
    </button>
  );
}

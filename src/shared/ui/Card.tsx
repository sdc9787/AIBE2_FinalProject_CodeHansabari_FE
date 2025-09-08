interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded border p-4 shadow">
      {/*제목 */}
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

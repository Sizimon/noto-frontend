export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Add any public header/footer here if needed */}
      {children}
    </div>
  );
}
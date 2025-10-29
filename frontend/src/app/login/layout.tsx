import "../globals.css";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="headerSpacer" aria-hidden />
        {children}
    </>
  );
}


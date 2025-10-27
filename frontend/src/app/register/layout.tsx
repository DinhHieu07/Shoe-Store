import '../globals.css';

export default function RegisterLayout({
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
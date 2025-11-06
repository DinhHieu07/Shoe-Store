import '../../globals.css';

export default function VouchersLayout({
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
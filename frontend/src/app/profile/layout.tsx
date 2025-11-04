import '../globals.css';

export default function ProfileLayout({
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
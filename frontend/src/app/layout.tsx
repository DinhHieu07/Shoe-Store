import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SHOE STORE | Authentic Sneakers",
  description: "Cửa hàng bán giày chính hãng tại Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <div className="headerSpacer" aria-hidden />
        <main className="pageMain">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>

    </html>
  );
}

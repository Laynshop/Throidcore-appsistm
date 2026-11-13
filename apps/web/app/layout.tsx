import "./globals.css";

export const metadata = {
  title: "Throidcore — Workspace de automação",
  description: "Organize projetos e workflows em um workspace criado para fazer o trabalho avançar.",
};

export const viewport = {
  themeColor: "#f6f7f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

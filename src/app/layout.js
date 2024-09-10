import "./globals.css";


export const metadata = {
  title: "Wobot.ai",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}

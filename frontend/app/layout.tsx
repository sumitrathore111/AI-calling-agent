import "./globals.css";
import Sidebar from "../components/Sidebar";
 // if layout.tsx and components folder are in the same level


export const metadata = {
  title: "AI Dashboard",
  description: "Voice Agent Services"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

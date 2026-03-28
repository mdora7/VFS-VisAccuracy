import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VFS VisAccuracy - Turkey Visa Tracker",
  description: "Track VFS visa appointments and application status for Turkey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

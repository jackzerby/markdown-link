export default function PublicViewerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="theme-viewer" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}

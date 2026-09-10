import Footer from "@/components/footer";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    {children}
    <Footer />
    </>
  );
}
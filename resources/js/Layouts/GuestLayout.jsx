import Header from "../Components/Navigation/Guest/Header"; // Adjust paths as necessary
import Footer from "../Components/Navigation/Guest/Footer";

export default function GuestLayout({ children }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                position: "bottom-right",
                duration: 4000,
                style: {
                    borderRadius: "12px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                position: "top-right",
            });
        }
    }, [flash]);
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

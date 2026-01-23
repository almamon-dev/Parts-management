import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, usePage } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

function FlashMessages({ children }) {
    const { flash, errors } = usePage().props;

    useEffect(() => {
        // server side (Flash Success)
        if (flash?.success) {
            toast.success(flash.success, { position: "bottom-right" });
        }

        // server side (Flash Error)
        if (flash?.error) {
            toast.error(flash.error, { position: "top-center" });
        }

        // server side (Flash Warning)
        if (flash?.warning) {
            toast(flash.warning, {
                icon: "⚠️",
                position: "top-center",
                duration: 4000,
            });
        }
    }, [flash, errors]);

    return (
        <>
            <Toaster />
            {children}
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        );

        page.default.layout =
            page.default.layout ||
            ((page) => <FlashMessages>{page}</FlashMessages>);

        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: false,
});

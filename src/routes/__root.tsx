import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BookingProvider } from "@/lib/booking-context";
import { BookingOverlay } from "@/components/booking/BookingOverlay";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <div className="eyebrow mb-8">Σφάλμα 404</div>
        <h1 className="font-display text-7xl md:text-8xl text-ivory leading-none">
          Δεν βρέθηκε
        </h1>
        <p className="mt-6 text-muted-foreground">
          Η σελίδα που ψάχνετε έχει μετακινηθεί ή δεν υπάρχει. Επιστρέψτε
          στην αρχική και θα σας οδηγήσουμε από εκεί.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-ivory text-onyx text-sm uppercase tracking-wide hover:bg-gold transition-colors"
          >
            Επιστροφή στην Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <div className="eyebrow mb-8">Κάτι πήγε στραβά</div>
        <h1 className="font-display text-5xl md:text-6xl text-ivory">
          Η σελίδα δεν φόρτωσε
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Δοκιμάστε ξανά ή επιστρέψτε στην Αρχική.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-ivory text-onyx text-sm uppercase tracking-wide hover:bg-gold transition-colors"
          >
            Δοκιμή ξανά
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-ivory/20 text-ivory text-sm uppercase tracking-wide hover:border-gold hover:text-gold transition-colors"
          >
            Αρχική
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#181613" },
      {
        title:
          "La Barbería Social Club — Κουρείο στη Λαμπρινή, Αθήνα",
      },
      {
        name: "description",
        content:
          "Χώρος ανδρικής περιποίησης στη Λαμπρινή. Παραδοσιακό κούρεμα, γένια και ξύρισμα, με σύγχρονη ματιά. Κλείσε το ραντεβού σου.",
      },
      { name: "author", content: "La Barbería Social Club" },
      {
        property: "og:title",
        content: "La Barbería Social Club — Κουρείο στη Λαμπρινή, Αθήνα",
      },
      {
        property: "og:description",
        content:
          "Το κουρείο, όπως πρέπει να είναι. Ι. Φωκά 90, Λαμπρινή.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "el_GR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="el" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <BookingOverlay />
        <Toaster theme="dark" position="bottom-center" />
      </BookingProvider>
    </QueryClientProvider>
  );
}

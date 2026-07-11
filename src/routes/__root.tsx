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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <div className="eyebrow mb-8">Error 404</div>
        <h1 className="font-display text-7xl md:text-8xl text-ivory leading-none">
          Not found
        </h1>
        <p className="mt-6 text-muted-foreground">
          The page you are looking for has moved, or never existed. Return to
          the shop and we will take it from there.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-ivory text-onyx text-sm uppercase tracking-wide hover:bg-gold transition-colors"
          >
            Return home
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
        <div className="eyebrow mb-8">Something went wrong</div>
        <h1 className="font-display text-5xl md:text-6xl text-ivory">
          This page didn't load
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          A momentary interruption. Please try again or return home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-ivory text-onyx text-sm uppercase tracking-wide hover:bg-gold transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-ivory/20 text-ivory text-sm uppercase tracking-wide hover:border-gold hover:text-gold transition-colors"
          >
            Go home
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
          "La Barberia Social Club — Luxury Barbershop in Galatsi, Athens",
      },
      {
        name: "description",
        content:
          "A private, members-styled barbershop in Galatsi, Athens. Traditional grooming, straight-razor shaves, and a distinctly modern hospitality.",
      },
      { name: "author", content: "La Barberia Social Club" },
      {
        property: "og:title",
        content:
          "La Barberia Social Club — Luxury Barbershop in Galatsi, Athens",
      },
      {
        property: "og:description",
        content:
          "The gentleman's ritual, reimagined. Book your appointment at La Barberia Social Club, Galatsi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
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
    <html lang="en" className="dark">
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
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

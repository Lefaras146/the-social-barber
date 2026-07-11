"use client";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LuxeLink } from "./LuxeButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding,background] duration-500",
          scrolled ? "py-3 glass-nav" : "py-6",
        )}
      >
        <div className="container-luxe flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-baseline gap-3"
            aria-label="La Barbería Social Club"
          >
            <span className="font-display text-2xl md:text-3xl tracking-tight text-ivory leading-none">
              La Barbería
            </span>
            <span className="hidden md:inline eyebrow text-[0.6rem] text-muted-foreground">
              Social Club · Λαμπρινή
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => {
              const active =
                link.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "text-[0.72rem] uppercase tracking-[0.28em] transition-colors duration-300",
                    active
                      ? "text-gold"
                      : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LuxeLink
              to="/book"
              variant="solid"
              className="hidden md:inline-flex !px-6 !py-3 text-[0.7rem]"
              withArrow={false}
            >
              Ραντεβού
            </LuxeLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden text-ivory hover:text-gold transition-colors"
              aria-label="Άνοιγμα μενού"
            >
              <Menu className="h-6 w-6" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-onyx"
          >
            <div className="container-luxe flex items-center justify-between py-6">
              <span className="font-display text-2xl text-ivory">
                La Barbería
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ivory hover:text-gold transition-colors"
                aria-label="Κλείσιμο μενού"
              >
                <X className="h-6 w-6" strokeWidth={1.4} />
              </button>
            </div>
            <nav className="container-luxe pt-16 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={link.to}
                    className="font-display text-5xl text-ivory hover:text-gold transition-colors duration-300 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-10"
              >
                <LuxeLink to="/book">Κλείσε ραντεβού</LuxeLink>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

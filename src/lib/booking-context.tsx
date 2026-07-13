import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Ctx = {
  isOpen: boolean;
  initialServiceId: string | null;
  initialBarberId: string | null;
  open: (opts?: { serviceId?: string; barberId?: string }) => void;
  close: () => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialServiceId, setService] = useState<string | null>(null);
  const [initialBarberId, setBarber] = useState<string | null>(null);

  const open = useCallback((opts?: { serviceId?: string; barberId?: string }) => {
    setService(opts?.serviceId ?? null);
    setBarber(opts?.barberId ?? null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookingCtx.Provider value={{ isOpen, initialServiceId, initialBarberId, open, close }}>
      {children}
    </BookingCtx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}

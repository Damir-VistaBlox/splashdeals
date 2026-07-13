"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";

interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  facilityName?: string;
  updatedAt: number;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface CartViewerProps {
  initialUser: UserData | null;
  initialCart: {
    id: string;
    items: unknown;
    locked: boolean;
    notified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export function CartViewer({ initialUser, initialCart }: CartViewerProps) {
  const [searchEmail, setSearchEmail] = React.useState("");
  const [user, setUser] = React.useState<UserData | null>(initialUser);
  const [cart, setCart] = React.useState<{
    id: string;
    items: unknown;
    locked: boolean;
    notified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null>(initialCart);
  const [loading, setLoading] = React.useState(false);

  const formatPrice = (price: number) => new Intl.NumberFormat("sr-RS").format(price);

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/cart?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();
      if (data.user) setUser(data.user);
      else toast.error("Korisnik nije pronađen");
      if (data.cart) setCart(data.cart);
      else setCart(null);
    } catch {
      toast.error("Greška pri pretrazi");
    } finally {
      setLoading(false);
    }
  };

  const items: CartItem[] = Array.isArray(cart?.items) ? (cart.items as CartItem[]) : [];

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="border-border bg-muted/20 flex items-center gap-4 p-6">
        <Input
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Pretraži po email adresi..."
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Pretraga..." : "Traži"}
        </Button>
      </Card>

      {/* User Info */}
      {user && (
        <Card className="border-border bg-muted/20 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{user.name || "Nepoznato"}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Cart Data */}
      {cart && (
        <Card className="border-border bg-muted/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black tracking-widest uppercase">Korpa</h3>
            <div className="flex items-center gap-3 text-xs">
              {cart.locked && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 font-bold text-amber-500">
                  Zaključano
                </span>
              )}
              {cart.notified && <span className="text-muted-foreground">Obavešten poslat</span>}
              <span className="text-muted-foreground">
                {new Date(cart.updatedAt).toLocaleDateString("sr-RS")}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">Korpa je prazna</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-border flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.facilityName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)} RSD</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity} × {formatPrice(item.price)} RSD
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span>Ukupno</span>
                <span>{formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0))} RSD</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {!user && !cart && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="shopping_cart" className="text-muted-foreground/30 text-[48px]" />
          <p className="text-muted-foreground mt-4 text-sm">
            Unesite email korisnika za pregled korpe
          </p>
        </div>
      )}
    </div>
  );
}

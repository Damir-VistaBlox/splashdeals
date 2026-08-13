"use client";
import { Icon } from "@/components/ui/Icon";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminUserAction } from "@/app/(server)/actions/users";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const formSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite ispravnu email adresu"),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
  role: z.nativeEnum(UserRole),
});

export function CreateUserForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.FACILITY_STAFF,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const result = await createAdminUserAction(values);
      if (result.success) {
        toast.success("Administratorski nalog je uspešno kreiran");
        router.push("/admin/users");
      } else {
        toast.error(result.error || "Kreiranje administratorskog naloga nije uspelo");
      }
    } catch {
      toast.error("Došlo je do neočekivane greške");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                Ime i prezime
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Damir K."
                  className="bg-background border-border focus:border-ring h-11 rounded-xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold tracking-tight text-red-400 uppercase" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                Službeni email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@splashdeals.rs"
                  className="bg-background border-border focus:border-ring h-11 rounded-xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold tracking-tight text-red-400 uppercase" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                Privremena lozinka
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-background border-border focus:border-ring h-11 rounded-xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-[9px] tracking-tighter uppercase">
                Minimum 8 karaktera. Korisnik kasnije može da je resetuje putem emaila.
              </FormDescription>
              <FormMessage className="text-[10px] font-bold tracking-tight text-red-400 uppercase" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                Nivo pristupa
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background border-border focus:border-ring h-11 rounded-xl transition-all">
                    <SelectValue placeholder="Izaberite ulogu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border-border text-foreground">
                  <SelectItem
                    value={UserRole.FACILITY_STAFF}
                    className="focus:bg-muted/30 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="manage_accounts" className="text-[14px] text-amber-400" />
                      <span>Operater objekta</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value={UserRole.SUPER_ADMIN}
                    className="focus:bg-muted/30 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="security" className="text-primary text-[14px]" />
                      <span>Super admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-[10px] font-bold tracking-tight text-red-400 uppercase" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl text-[11px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300"
        >
          {isPending ? (
            <Icon name="progress_activity" className="animate-spin text-[16px]" />
          ) : (
            "Kreiraj administratorski nalog"
          )}
        </Button>
      </form>
    </Form>
  );
}

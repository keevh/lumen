"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { AdminCard, AdminField, AdminPageHeader, adminInputClass } from "@/components/admin/AdminPrimitives";
import { adminSessionKey } from "@/components/admin/AdminLayout";

const adminEmailKey = "lumens-admin-email";
const adminPasswordKey = "lumens-admin-password";
const defaultEmail = "admin@lumen.local";
const defaultPassword = "lumen-demo";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setEmail(localStorage.getItem(adminEmailKey) ?? defaultEmail);
    setPassword(localStorage.getItem(adminPasswordKey) ?? defaultPassword);
  }, []);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const savedEmail = localStorage.getItem(adminEmailKey) ?? defaultEmail;
    const savedPassword = localStorage.getItem(adminPasswordKey) ?? defaultPassword;

    if (email !== savedEmail || password !== savedPassword) {
      setError("El correo o la contraseña no coinciden con la configuración local.");
      return;
    }

    sessionStorage.setItem(adminSessionKey, "active");
    router.replace("/admin");
  }

  return (
    <div className="mx-auto max-w-lg pt-10">
      <AdminPageHeader title="Ingreso administrativo" description="Acceso local de demostración. Las credenciales se completan automáticamente en este navegador." />
      {error ? <p className="mb-4 rounded-lg bg-error-container px-4 py-3 text-on-error-container" role="alert">{error}</p> : null}
      <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
      <AdminCard>
        <form className="space-y-5" onSubmit={login}>
          <AdminField label="Correo administrativo"><input className={adminInputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@lumen.local" /></AdminField>
          <AdminField label="Contraseña"><input className={adminInputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="lumen-demo" /></AdminField>
          <button className="w-full rounded bg-primary px-5 py-3 text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" type="submit">Ingresar</button>
        </form>
        <div className="mt-4 flex justify-center">
          <Link className="rounded-full px-4 py-2 text-sm text-primary transition-colors duration-200 hover:bg-surface-variant" href="/">Volver al inicio</Link>
        </div>
      </AdminCard>
      </motion.div>
    </div>
  );
}

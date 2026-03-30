"use client";

import { FormEvent, useEffect, useState } from "react";
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem(adminEmailKey) ?? defaultEmail);
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
      <AdminPageHeader title="Ingreso administrativo" description="Acceso local de demostración guardado en este navegador." />
      {error ? <p className="mb-4 rounded-lg bg-error-container px-4 py-3 text-on-error-container" role="alert">{error}</p> : null}
      <AdminCard>
        <form className="space-y-5" onSubmit={login}>
          <AdminField label="Correo administrativo"><input className={adminInputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></AdminField>
          <AdminField label="Contraseña"><input className={adminInputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="lumen-demo" /></AdminField>
          <button className="w-full rounded bg-primary px-5 py-3 text-on-primary" type="submit">Ingresar</button>
        </form>
      </AdminCard>
    </div>
  );
}

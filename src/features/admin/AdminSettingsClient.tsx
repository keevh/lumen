"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminCard, AdminField, AdminPageHeader, adminInputClass } from "@/components/admin/AdminPrimitives";
import { Toast, useTimedToast } from "@/components/ui/Toast";
import type { StoreSettings } from "@/features/settings/settings.types";
import { FALLBACK_BROWSER_LOCALE, getBrowserLocale } from "@/shared/browser-locale";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

const fallbackSettings: StoreSettings = { id: "store", storeName: "LUMEN", currency: "USD", taxRate: 0.1, locale: FALLBACK_BROWSER_LOCALE, updatedAt: "" };
const adminEmailKey = "lumens-admin-email";
const adminPasswordKey = "lumens-admin-password";
const defaultEmail = "admin@lumen.local";

export function AdminSettingsClient() {
  const repositories = useBrowserRepositories();
  const [settings, setSettings] = useState<StoreSettings>(() => ({ ...fallbackSettings, locale: getBrowserLocale(fallbackSettings.locale) }));
  const [adminEmail, setAdminEmail] = useState(defaultEmail);
  const [adminPassword, setAdminPassword] = useState("");
  const { message, tone, showToast } = useTimedToast();

  useEffect(() => {
    if (!repositories) return;
    repositories.settings.getStoreSettings().then(setSettings).catch(() => showToast("No pudimos cargar la configuración.", "error"));
  }, [repositories]);

  useEffect(() => {
    setAdminEmail(localStorage.getItem(adminEmailKey) ?? defaultEmail);
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repositories) return;
    await repositories.settings.saveStoreSettings({ ...settings, taxRate: Number(settings.taxRate), updatedAt: new Date().toISOString() });
    showToast("Configuración guardada.");
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem(adminEmailKey, adminEmail);
    if (adminPassword) localStorage.setItem(adminPasswordKey, adminPassword);
    setAdminPassword("");
    showToast("Datos de acceso guardados localmente.");
  }

  return (
    <>
      <Toast message={message} tone={tone} />
      <AdminPageHeader title="Configuración" description="Ajustes generales de la tienda guardados localmente en el navegador." />
      <div className="grid gap-6 xl:grid-cols-2">
      <AdminCard>
        <h2 className="mb-4 font-headline-sm text-headline-sm">Tienda</h2>
        <form className="space-y-5" onSubmit={saveSettings}>
          <AdminField label="Nombre de la tienda"><input className={adminInputClass} value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} /></AdminField>
          <AdminField label="Moneda"><input className={adminInputClass} value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })} /></AdminField>
          <AdminField label="Impuesto"><input className={adminInputClass} min="0" step="0.01" type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} /></AdminField>
          <AdminField label="Idioma / región"><input className={adminInputClass} value={settings.locale} onChange={(e) => setSettings({ ...settings, locale: e.target.value })} /></AdminField>
          <button className="rounded bg-primary px-5 py-3 text-on-primary" type="submit">Guardar configuración</button>
        </form>
      </AdminCard>
      <AdminCard>
        <h2 className="mb-4 font-headline-sm text-headline-sm">Cuenta y seguridad</h2>
        <p className="mb-5 text-sm text-on-surface-variant">Credenciales locales de demostración para este navegador. No reemplazan autenticación real de servidor.</p>
        <form className="space-y-5" onSubmit={saveAccount}>
          <AdminField label="Correo administrativo"><input className={adminInputClass} type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} /></AdminField>
          <AdminField label="Nueva contraseña local"><input className={adminInputClass} type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Dejar vacío para mantener la actual" /></AdminField>
          <button className="rounded bg-primary px-5 py-3 text-on-primary" type="submit">Guardar acceso</button>
        </form>
      </AdminCard>
      </div>
    </>
  );
}

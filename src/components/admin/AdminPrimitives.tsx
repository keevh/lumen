export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return <header className="mb-8"><h1 className="font-headline-md text-headline-md text-on-background">{title}</h1><p className="mt-2 text-on-surface-variant">{description}</p></header>;
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 soft-shadow ${className}`}>{children}</section>;
}

export function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm text-on-surface-variant">{label}</span>{children}</label>;
}

export function AdminModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="admin-modal-title" className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <button className="rounded-full px-3 py-1 text-on-surface-variant hover:bg-surface-variant" type="button" onClick={onClose} aria-label="Cerrar modal">Cerrar</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const adminInputClass = "lumen-input w-full rounded px-3 py-2 text-on-surface";

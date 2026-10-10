import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-80 xl:w-96 bg-ink flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold">
            IS
          </div>
        </div>
        <div>
          <h2 className="font-display text-4xl text-white italic leading-snug">
            Gestion des stocks d&apos;imprimerie
          </h2>
          <p className="mt-3 text-sm text-white/40 tracking-wide">Papier · Encre · Plaques · Divers</p>
        </div>
        <p className="text-xs text-white/20">Imprimerie Stock</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">IS</div>
            <span className="font-semibold text-text">Imprimerie Stock</span>
          </div>

          <h1 className="page-title mb-1.5">Connexion</h1>
          <p className="text-sm text-muted mb-8">Accédez à votre espace de gestion</p>

          <div className="card p-7">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

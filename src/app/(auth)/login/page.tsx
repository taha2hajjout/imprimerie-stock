import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🖨️</div>
            <h1 className="text-2xl font-bold text-gray-900">Imprimerie Stock</h1>
            <p className="mt-1 text-sm text-gray-500">Connectez-vous pour accéder à votre espace</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Email" />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

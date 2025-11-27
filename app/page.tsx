export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold">Voismi</h1>
      <p className="text-gray-600 mt-2">
        International calling for organizations and users
      </p>

      <a
        href="/auth/login"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Login
      </a>
    </div>
  );
}

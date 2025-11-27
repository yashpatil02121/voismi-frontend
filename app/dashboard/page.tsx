import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <Link href="/dashboard/organizations" className="card">
          Organizations
        </Link>

        <Link href="/dashboard/users" className="card">
          Users
        </Link>

        <Link href="/dashboard/phones" className="card">
          Phone Numbers
        </Link>

        <Link href="/dashboard/payments" className="card">
          Payments
        </Link>

        <Link href="/dashboard/calls" className="card">
          Calls
        </Link>
      </div>
    </div>
  );
}

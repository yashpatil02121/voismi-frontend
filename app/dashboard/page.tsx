export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <a href="/dashboard/organizations" className="card">Organizations</a>
        <a href="/dashboard/users" className="card">Users</a>
        <a href="/dashboard/phones" className="card">Phone Numbers</a>
        <a href="/dashboard/payments" className="card">Payments</a>
        <a href="/dashboard/calls" className="card">Calls</a>
      </div>
    </div>
  );
}

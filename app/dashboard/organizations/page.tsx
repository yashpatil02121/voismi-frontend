"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { http } from "@/lib/http";
import type { Organization } from "@/types/models";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const res = await http.get("/organizations/list");
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Organizations</h1>

        <Link
          href="/dashboard/organizations/create"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Create
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : organizations.length === 0 ? (
          <p className="text-gray-600">No organizations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="p-4 bg-white shadow rounded hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{org.name}</h2>
                <p className="text-gray-600 text-sm">{org.email}</p>

                <Link
                  href={`/dashboard/organizations/${org.id}`}
                  className="text-blue-600 mt-2 inline-block"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

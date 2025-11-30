"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { http } from "@/lib/http";
import type { Organization } from "@/types/models";

interface OrgMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await http.get(`/organizations/${id}`);
      setOrg(res.data.organization);
      setMembers(res.data.members);
    } catch (err) {
      console.error("Failed to load organization:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!id) return;
  if (typeof window === "undefined") return; // <— FIX

  fetchDetails();
}, [id]);


  return (
    <div className="p-8">
      <Link href="/dashboard/organizations" className="text-blue-600">
        ← Back
      </Link>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : !org ? (
        <p className="mt-4 text-gray-600">Organization not found.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {/* ORG CARD */}
          <div className="bg-white p-6 shadow rounded">
            <h1 className="text-2xl font-semibold">{org.name}</h1>
            <p className="text-gray-700">{org.email}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-sm">{org.city || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-sm">{org.country || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-sm">{org.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax ID</p>
                <p className="text-sm">{org.tax_id || "—"}</p>
              </div>
            </div>
          </div>

          {/* MEMBERS LIST */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Members</h2>

            {members.length === 0 ? (
              <p className="text-gray-600">No members found.</p>
            ) : (
              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">{m.user?.name}</p>
                      <p className="text-sm text-gray-600">{m.user?.email}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Role: <span className="text-blue-600">{m.role}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        Status: {m.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

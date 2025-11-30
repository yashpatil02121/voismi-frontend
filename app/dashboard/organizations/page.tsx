"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { http } from "@/lib/http";
import type { Organization } from "@/types/models";


// ShadCN Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false); // dialog control
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    address: "",
    postal_code: "",
    tax_id: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  // -------------------------
  // CREATE ORGANIZATION
  // -------------------------
  const handleCreate = async () => {
    try {
      const res = await http.post("/organizations/create", form);

      // Close dialog and refresh list
      setOpen(false);
      fetchOrganizations();

      // Clear form
      setForm({
        name: "",
        email: "",
        city: "",
        country: "",
        address: "",
        postal_code: "",
        tax_id: "",
      });
    } catch (error) {
      console.error("Create org failed:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Organizations</h1>

        {/* CREATE BUTTON */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Organization
            </Button>
          </DialogTrigger>

          {/* MODAL CONTENT */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                name="name"
                placeholder="Organization Name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
              <Input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
              />
              <Input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />
              <Input
                name="postal_code"
                placeholder="Postal Code"
                value={form.postal_code}
                onChange={handleChange}
              />
              <Input
                name="tax_id"
                placeholder="Tax ID"
                value={form.tax_id}
                onChange={handleChange}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleCreate} className="bg-blue-600 text-white">
                Confirm Create 
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ORGANIZATIONS LIST */}
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

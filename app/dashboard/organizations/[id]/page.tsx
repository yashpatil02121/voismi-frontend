"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { http } from "@/lib/http";
import type { Organization } from "@/types/models";
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
// import TelnyxRTC from "@telnyx/webrtc";
import { TelnyxRTC } from "@telnyx/webrtc";

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
  const [openAddMember, setOpenAddMember] = useState(false);

  const [dialerOpen, setDialerOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [callResponse, setCallResponse] = useState<any>(null);
  const [webrtcToken, setWebrtcToken] = useState("");
  const [callStatus, setCallStatus] = useState<string>("idle");

  // Telnyx WebRTC client reference (persists across renders)
  const clientRef = useRef<any>(null);

  const fetchVoiceToken = async () => {
    const res = await http.get("/calls/voice/token");
    localStorage.setItem("telnyx_webrtc_token", res.data.token);
    setWebrtcToken(res.data.token);
  };

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

  const handleCallButtonClick = async () => {
    // fetch WebRTC token then open dialer
    await fetchVoiceToken();
    setDialerOpen(true);
  };

  function AddMemberDialog({
    orgId,
    onAdded,
  }: {
    orgId: string;
    onAdded: () => void;
  }) {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const addMember = async () => {
      setLoading(true);
      try {
        const res = await http.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          org_id: orgId,
        });

        const createdUser = res.data.data;

        await http.post(`/organizations/${orgId}/add-member`, {
          user_id: createdUser.id,
          role: "member",
        });

        setForm({ name: "", email: "", password: "" });

        onAdded(); // <-- this will close dialog now
      } catch (err) {
        console.error("Add member error:", err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              name="name"
              placeholder="Full Name"
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
              type="password"
              name="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={addMember}
              disabled={loading}
              className="bg-blue-600 text-white"
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    );
  }

  // Load org + members
  useEffect(() => {
    if (!id) return;
    if (typeof window === "undefined") return;

    fetchDetails();
  }, [id]);

  // Initialize Telnyx WebRTC client whenever we have a fresh token
useEffect(() => {
  const token = localStorage.getItem("telnyx_webrtc_token");
  if (!token) return;

  // Prevent double initialization
  if (clientRef.current) return;

  const client = new TelnyxRTC({
    login_token: token,
  });

  clientRef.current = client;

  /** -------------------------
   *  TELNYX READY
   * ------------------------*/
  client.on("telnyx.ready", () => {
    console.log("WebRTC ready");
  });

  /** -------------------------
   *  AUDIO STREAM HANDLING (THE CORRECT WAY)
   * ------------------------*/
  client.on("telnyx.notification", (notif: any) => {

    if (notif.payload?.call?.remoteStream) {
      const remote = document.getElementById("incoming") as HTMLAudioElement;
      remote.srcObject = notif.payload.call.remoteStream;
      remote.play();
    }

    if (notif.payload?.call?.localStream) {
      const local = document.getElementById("outgoing") as HTMLAudioElement;
      local.srcObject = notif.payload.call.localStream;
    }
  });

  /** -------------------------
   *  CONNECT TO TELNYX
   * ------------------------*/
  client.connect();

  return () => {
    client.disconnect();
    clientRef.current = null;
  };
}, [webrtcToken]);


const startWebRTCCall = async () => {
  const client = clientRef.current;
  if (!client) return;

  const call = await client.newCall({
    destinationNumber: dialNumber,
    callerNumber: "+12129833272",
  });

  console.log("Call started:", call);
  setCallStatus("ringing");
};


  const hangupWebRTCCall = () => {
  const client = clientRef.current;
  if (!client) return;

  client.hangupCall();
  setCallStatus("hangup");
};


  return (
    <div className="p-8">
      {/* Audio elements for Telnyx WebRTC */}
    <audio id="incoming" autoPlay playsInline></audio>
<audio id="outgoing" playsInline></audio>




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
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{org.name}</h1>
                <p className="text-gray-700">{org.email}</p>
              </div>
              <div className="font-bold flex justify-center items-center bg-blue-600 text-white p-4 rounded-lg shadow">
                <h3>Balance ${org.balance}</h3>
              </div>
            </div>

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Members</h2>

              {/* ADD MEMBER BUTTON */}
              <Dialog open={openAddMember} onOpenChange={setOpenAddMember}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white">Add Member</Button>
                </DialogTrigger>

                <AddMemberDialog
                  orgId={id as string}
                  onAdded={() => {
                    fetchDetails();
                    setOpenAddMember(false); // CLOSE DIALOG
                  }}
                />
              </Dialog>
            </div>

            {members.length === 0 ? (
              <p className="text-gray-600">No members found.</p>
            ) : (
              <div className="space-y-3">
                {/* 📞 Call Button */}
                <Button
                  className="bg-green-600 text-white px-3 py-1 text-sm"
                  onClick={handleCallButtonClick}
                >
                  Call
                </Button>

                <>
                  <Dialog open={dialerOpen} onOpenChange={setDialerOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dial a Number</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-3">
                        <Input
                          placeholder="Enter phone number"
                          value={dialNumber}
                          onChange={(e) => setDialNumber(e.target.value)}
                        />
                      </div>

                      {/* CALL + HANGUP BUTTONS */}
                      <DialogFooter className="flex justify-between mt-4">
                        <Button
                          className="bg-green-600 text-white"
                          onClick={startWebRTCCall}
                        >
                          Call
                        </Button>

                        <Button
                          className="bg-red-600 text-white"
                          onClick={hangupWebRTCCall}
                        >
                          Hang Up
                        </Button>
                      </DialogFooter>

                      {callStatus !== "idle" && (
                        <p className="text-sm text-gray-700">
                          Status: {callStatus}
                        </p>
                      )}

                      {callResponse && callResponse.callId && (
                        <p className="text-sm text-gray-700">
                          Call ID: {callResponse.callId}
                        </p>
                      )}
                    </DialogContent>
                  </Dialog>
                </>

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
                      <p className="text-xs text-gray-600">Status: {m.status}</p>
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

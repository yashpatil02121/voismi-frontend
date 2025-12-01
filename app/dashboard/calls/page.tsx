'use client';

import { useState, useEffect } from 'react';
import { TelnyxRTC } from '@telnyx/rtc';

export default function DialerPage() {
  const [client, setClient] = useState<any>(null);
  const [status, setStatus] = useState('Initializing...');
  const [from, setFrom] = useState('+15551231234');
  const [to, setTo] = useState('');

  useEffect(() => {
    async function initTelnyx() {
      try {
        const res = await fetch('/api/telnyx/token', { method: 'POST' });
        const { token } = await res.json();

        const telnyxClient = new TelnyxRTC({ login_token: token });

        telnyxClient
          .on('telnyx.ready', () => setStatus('Ready'))
          .on('telnyx.notification', (notification: any) => {
            if (notification.type === 'callUpdate') {
              setStatus(`Call ${notification.call.state}`);
            }
          });

        await telnyxClient.connect();
        setClient(telnyxClient);
      } catch (err) {
        console.error('Telnyx init error:', err);
        setStatus('Failed to initialize');
      }
    }

    initTelnyx();
  }, []);

  const makeCall = () => {
    if (!client) return;
    setStatus('Dialing...');
    client.newCall({ destinationNumber: to, callerNumber: from });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Telnyx WebRTC Dialer</h1>
      <div className="space-y-4">
        <div>
          <label>From Number:</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="+15551231234">+1 555 123 1234</option>
          </select>
        </div>
        <div>
          <label>To Number:</label>
          <input
            type="tel"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g. +18005551234"
          />
        </div>
        <button onClick={makeCall} className="bg-blue-600 text-white px-4 py-2 rounded">
          Call
        </button>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}

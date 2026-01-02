import { useState, useEffect } from 'react';
import { Settings, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Player {
  id: string;
  name: string;
  phone_number: string | null;
  email: string | null;
}

export function PlayerSetup() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<{ [key: string]: string }>({});
  const [emails, setEmails] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wordle-webhook`;

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('name');

    if (data) {
      setPlayers(data);
      const phoneMap: { [key: string]: string } = {};
      const emailMap: { [key: string]: string } = {};
      data.forEach((player) => {
        phoneMap[player.id] = player.phone_number || '';
        emailMap[player.id] = player.email || '';
      });
      setPhoneNumbers(phoneMap);
      setEmails(emailMap);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      for (const player of players) {
        const phoneNumber = phoneNumbers[player.id]?.replace(/[^0-9]/g, '') || null;
        const email = emails[player.id]?.trim().toLowerCase() || null;

        const { error } = await supabase
          .from('players')
          .update({
            phone_number: phoneNumber || null,
            email: email || null
          })
          .eq('id', player.id);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Contact information saved successfully!' });
      fetchPlayers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save contact information' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatPhoneForDisplay = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Setup Email Submissions
        </h2>
        <span className="text-gray-500">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Send Scores via Email:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Add the webhook URL below to your Mailgun Routes</li>
              <li>Set up a route to forward emails to the webhook</li>
              <li>Enter your email addresses below</li>
              <li>Forward or send your Wordle results to your Mailgun email</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Webhook URL:
            </h3>
            <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm break-all">
              {webhookUrl}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Add this URL to your Mailgun inbound route as a forward action
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Register Email Addresses:</h3>
            {players.map((player) => (
              <div key={player.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {player.name}'s Email
                </label>
                <input
                  type="email"
                  value={emails[player.id] || ''}
                  onChange={(e) =>
                    setEmails({ ...emails, [player.id]: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {player.email && (
                  <p className="text-xs text-gray-500">
                    Current: {player.email}
                  </p>
                )}
              </div>
            ))}
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Email Addresses'}
          </button>
        </div>
      )}
    </div>
  );
}

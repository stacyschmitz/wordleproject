import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ParsedWordle {
  puzzleNumber: number;
  guesses: number;
  shareText: string;
}

function parseWordleShare(text: string): ParsedWordle | null {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return null;

  const firstLine = lines[0];
  const wordleRegex = /Wordle\s+([\d,]+)\s+([X\d])\/6/i;
  const match = firstLine.match(wordleRegex);

  if (!match) return null;

  const puzzleNumber = parseInt(match[1].replace(/,/g, ''));
  const guessesStr = match[2];
  const guesses = guessesStr === 'X' ? 7 : parseInt(guessesStr);

  return {
    puzzleNumber,
    guesses,
    shareText: text,
  };
}

function extractPhoneNumber(text: string): string | null {
  const phoneRegex = /\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const match = text.match(phoneRegex);
  if (match) {
    return match[1] + match[2] + match[3];
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type') || '';
      let messageBody = '';
      let senderPhone = '';
      let senderEmail = '';

      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        messageBody = (formData.get('stripped-text') || formData.get('body-plain') || formData.get('body') || formData.get('text') || '').toString();
        senderEmail = (formData.get('sender') || formData.get('from') || '').toString().toLowerCase();
        senderPhone = (formData.get('phone') || '').toString();
      } else if (contentType.includes('application/json')) {
        const data = await req.json();
        messageBody = data['stripped-text'] || data['body-plain'] || data.body || data.text || data.message || '';
        senderEmail = (data.sender || data.from || data.email || '').toLowerCase();
        senderPhone = data.phone || data.from || data.sender || '';
      } else {
        const text = await req.text();
        messageBody = text;
        senderPhone = extractPhoneNumber(text) || '';
      }

      senderPhone = senderPhone.toString().replace(/[^0-9]/g, '');
      if (senderPhone.length === 11 && senderPhone.startsWith('1')) {
        senderPhone = senderPhone.substring(1);
      }

      const parsed = parseWordleShare(messageBody.toString());
      if (!parsed) {
        return new Response(
          JSON.stringify({ error: 'Invalid Wordle format' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      let player = null;

      if (senderEmail) {
        const { data: emailPlayer } = await supabase
          .from('players')
          .select('name')
          .eq('email', senderEmail)
          .maybeSingle();
        player = emailPlayer;
      }

      if (!player && senderPhone) {
        const { data: phonePlayer } = await supabase
          .from('players')
          .select('name')
          .eq('phone_number', senderPhone)
          .maybeSingle();
        player = phonePlayer;
      }

      if (!player) {
        return new Response(
          JSON.stringify({ 
            error: 'Email or phone not recognized',
            email: senderEmail || 'none',
            phone: senderPhone || 'none',
            message: 'Please register your email or phone number first'
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const gameDate = new Date().toISOString().split('T')[0];

      const { error: dbError } = await supabase.from('wordle_games').insert({
        player_name: player.name,
        puzzle_number: parsed.puzzleNumber,
        guesses: parsed.guesses,
        game_date: gameDate,
        share_text: parsed.shareText,
      });

      if (dbError) {
        if (dbError.code === '23505') {
          return new Response(
            JSON.stringify({ message: 'Score already submitted for this puzzle' }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        throw dbError;
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          player: player.name,
          puzzle: parsed.puzzleNumber,
          guesses: parsed.guesses
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Wordle Webhook Endpoint' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
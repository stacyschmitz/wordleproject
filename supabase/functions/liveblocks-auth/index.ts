import { Liveblocks } from "npm:@liveblocks/node@2.16.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId || !['katie', 'stacy'].includes(userId.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: 'Invalid user ID' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const liveblocks = new Liveblocks({
      secret: Deno.env.get('LIVEBLOCKS_SECRET_KEY') || '',
    });

    const session = liveblocks.prepareSession(userId.toLowerCase(), {
      userInfo: {
        name: userId.toLowerCase() === 'katie' ? 'Katie' : 'Stacy',
      },
    });

    session.allow('*', session.FULL_ACCESS);

    const { status, body } = await session.authorize();

    return new Response(body, {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
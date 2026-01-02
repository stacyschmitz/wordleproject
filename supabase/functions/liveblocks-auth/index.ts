import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
    const LIVEBLOCKS_SECRET = Deno.env.get("LIVEBLOCKS_SECRET_KEY");

    if (!LIVEBLOCKS_SECRET) {
      return new Response(
        JSON.stringify({ error: "Liveblocks secret key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const liveblocks = new Liveblocks({
      secret: LIVEBLOCKS_SECRET,
    });

    const { room } = await req.json();
    const session = liveblocks.prepareSession(
      `user-${Math.random().toString(36).substring(7)}`,
      { userInfo: {} }
    );

    if (room) {
      session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();

    return new Response(body, {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in liveblocks-auth:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuthRequest {
  userId: string;
  roomId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, roomId }: AuthRequest = await req.json();

    if (!userId || !roomId) {
      return new Response(
        JSON.stringify({ error: "userId and roomId are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

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

    const response = await fetch("https://api.liveblocks.io/v2/rooms/" + roomId + "/users/" + userId + "/authorize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LIVEBLOCKS_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        groupIds: [],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Liveblocks API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to authorize with Liveblocks" }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
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
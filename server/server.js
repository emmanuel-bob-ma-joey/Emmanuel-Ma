import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import cors module
const app = express();

const PORT = process.env.PORT || 3000;
const strava_client_id = process.env.STRAVA_CLIENT_ID;
const strava_client_secret = process.env.STRAVA_CLIENT_SECRET;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Store token expiration time
let tokenExpiresAt = 0;

// Get Strava access token using refresh token (for server-side auth)
async function getStravaAccessToken() {
  const refresh_token = process.env.STRAVA_REFRESH_TOKEN;

  if (!refresh_token) {
    console.log("No refresh token found - need to do initial OAuth");
    return null;
  }

  try {
    console.log("Attempting to refresh Strava access token...");
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: strava_client_id,
        client_secret: strava_client_secret,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    console.log("Refresh token response:", JSON.stringify(data, null, 2));

    if (data.error || data.message) {
      console.error("Refresh token error:", data.error || data.message);
      console.error("Full error response:", data);
      return null;
    }

    // Update the refresh token and access token in environment
    process.env.STRAVA_REFRESH_TOKEN = data.refresh_token;
    process.env.STRAVA_ACCESS_TOKEN = data.access_token;

    // Store expiration time (expires_at is in seconds, convert to milliseconds)
    tokenExpiresAt = data.expires_at * 1000;

    const expiresIn = Math.floor((tokenExpiresAt - Date.now()) / 1000 / 60);
    console.log(
      `✅ Successfully refreshed access token (expires in ${expiresIn} minutes)`
    );

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Strava token:", error);
    return null;
  }
}

// Check if access token is expired or about to expire (within 5 minutes)
function isTokenExpired() {
  if (!tokenExpiresAt) return true;
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
  return tokenExpiresAt < fiveMinutesFromNow;
}

// Strava API endpoint
app.post("/strava-api", async (req, res) => {
  const { endpoint, period } = req.body;

  if (!endpoint) {
    return res.status(400).send({ error: "Missing endpoint" });
  }

  try {
    // Check if token is expired or missing, refresh if needed
    if (!process.env.STRAVA_ACCESS_TOKEN || isTokenExpired()) {
      console.log("Access token expired or missing, refreshing...");
      const newToken = await getStravaAccessToken();
      if (!newToken) {
        console.log(
          "❌ No valid Strava tokens available. Need to complete OAuth flow."
        );
        return res.status(401).send({
          error:
            "No valid Strava access token. Please complete OAuth authorization first.",
          needsAuth: true,
        });
      }
    }

    const accessToken = process.env.STRAVA_ACCESS_TOKEN;

    let url = `https://www.strava.com/api/v3/${endpoint}`;

    // Add query parameters for activities endpoint
    if (endpoint === "athlete/activities") {
      const now = new Date();
      let after;

      if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        after = Math.floor(weekAgo.getTime() / 1000);
      } else if (period === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        after = Math.floor(monthAgo.getTime() / 1000);
      }

      url += `?per_page=200${after ? `&after=${after}` : ""}`;
    }

    console.log("Making Strava API request to:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Strava API response status:", response.status);

    const data = await response.json();
    console.log("Strava API response data:", JSON.stringify(data, null, 2));

    if (data.error || data.message === "Authorization Error") {
      console.error("Strava API error:", data.error || data.message);

      // If we get an authorization error, try refreshing the token once
      if (data.message === "Authorization Error") {
        console.log("Got authorization error, attempting to refresh token...");
        const newToken = await getStravaAccessToken();

        if (newToken) {
          // Retry the request with the new token
          console.log("Retrying request with new token...");
          const retryResponse = await fetch(url, {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          const retryData = await retryResponse.json();

          if (retryData.error || retryData.message === "Authorization Error") {
            return res.status(401).send({
              error: retryData.message || retryData.error,
              needsAuth: true,
            });
          }

          console.log(
            "✅ Successfully fetched",
            retryData.length,
            "activities after token refresh"
          );
          return res.send(retryData);
        }

        return res.status(401).send({
          error: data.message,
          needsAuth: true,
        });
      }

      return res.status(400).send({ error: data.error || data.message });
    }

    console.log("✅ Successfully fetched", data.length, "activities");
    res.send(data);
  } catch (error) {
    console.error("Strava API request error:", error);
    res.status(500).send({ error: "Failed to fetch data from Strava API" });
  }
});

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Check if Strava refresh token is available
    if (process.env.STRAVA_REFRESH_TOKEN) {
      console.log(
        "✅ Strava refresh token found - will fetch access token as needed"
      );
    } else {
      console.log("⚠️  No Strava refresh token found - OAuth setup required");
      console.log("   Add STRAVA_REFRESH_TOKEN to your .env file");
    }
  });
}

// Export for Vercel serverless functions
export default app;

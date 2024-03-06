import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import cors module
const app = express();

const PORT = process.env.PORT || 3000;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

async function getSpotifyAccessToken() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with your actual client ID and client secret
        Authorization:
          "Basic " + btoa(spotify_client_id + ":" + spotify_client_secret),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        // Replace AUTHORIZATION_CODE with the actual authorization code you received
        code: "AUTHORIZATION_CODE",
        // Replace YOUR_REDIRECT_URI with your actual redirect URI
        redirect_uri: "https://emmanuelma.com",
      }),
    });

    const data = await response.json();
    console.log(data); // You can access the access token using data.access_token
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
}

// Call the function
getSpotifyAccessToken();

// Endpoint to proxy Spotify API requests
app.post("/spotify-api", async (req, res) => {
  const { endpoint, accessToken } = req.body;

  if (!endpoint || !accessToken) {
    return res.status(400).send({ error: "Missing endpoint or accessToken" });
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Spotify API request error:", error);
    res.status(500).send({ error: "Failed to fetch data from Spotify API" });
  }
});

app.get("/spotify-api", async (req, res) => {
  console.log("got request!");
  return res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

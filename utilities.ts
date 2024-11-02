// Configura qui il server locale e quello remoto
const LOCAL_SERVER_URL = "http://192.168.1.26:3000";
// const REMOTE_SERVER_URL = "https://camporapp.vercel.app";

// Scegli quale server usare commentando una delle due righe seguenti
//const CURRENT_SERVER_URL = LOCAL_SERVER_URL;
const CURRENT_SERVER_URL = LOCAL_SERVER_URL;

const getConfig = async () => {
  try {
    const response = await fetch(`${CURRENT_SERVER_URL}/api/config`);
    const config = await response.json();
    return config.serverUrl;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return "https://default-url.com"; // fallback
  }
};

export { getConfig, CURRENT_SERVER_URL };

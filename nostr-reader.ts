import { connect } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const RELAY_URL = "";

interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

interface Filter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  [key: string]: unknown;
}

class NostrReader {
  private ws: WebSocket | null = null;
  private subscriptionId: string;

  constructor() {
    this.subscriptionId = crypto.randomUUID();
  }

  async connect() {
    try {
      this.ws = new WebSocket(RELAY_URL);
      
      this.ws.onopen = () => {
        console.log("Connected to relay:", RELAY_URL);
        this.subscribe();
      };

      this.ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("Connection closed");
      };
    } catch (error) {
      console.error("Connection failed:", error);
    }
  }

  private subscribe() {
    if (!this.ws) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const filters: Filter[] = [
      {
        kinds: [1], // Only subscribe to text events
        since: currentTime,
      },
    ];

    const subscribeMessage = ["REQ", this.subscriptionId, ...filters];
    this.ws.send(JSON.stringify(subscribeMessage));
  }

  private handleMessage(data: unknown[]) {
    if (!Array.isArray(data)) return;
    const [type, subscriptionId, event] = data;
    
    if (type === "EVENT" && subscriptionId === this.subscriptionId) {
      const nostrEvent = event as NostrEvent;
      this.displayEvent(nostrEvent);
    }
  }

  private displayEvent(event: NostrEvent) {
    const date = new Date(event.created_at * 1000);
    console.log("\n-------------------");
    console.log("Time:", date.toLocaleString("ja-JP"));
    console.log("Content:", event.content);
    console.log("Author:", event.pubkey.slice(0, 8) + "...");
  }

  async close() {
    if (this.ws) {
      const unsubMessage = ["CLOSE", this.subscriptionId];
      this.ws.send(JSON.stringify(unsubMessage));
      this.ws.close();
    }
  }
}

const reader = new NostrReader();

Deno.addSignalListener("SIGINT", async () => {
  console.log("\nClosing connection...");
  await reader.close();
  Deno.exit();
});

await reader.connect();

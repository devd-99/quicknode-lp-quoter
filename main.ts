import { WebSocketClient, StandardWebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { ethers } from "npm:ethers";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

// Interface for pool events
interface PoolEvent {
  address: string;
  reserves?: [string, string];
  token0?: string;
  token1?: string;
  data: string;
  topics: string[];
  transactionHash: string;
}

class PoolMonitor {
  private ws: WebSocketClient;

  constructor(quicknodeWsUrl: string, private poolAddress: string) {
    this.ws = new StandardWebSocketClient(quicknodeWsUrl);
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.on("open", () => {
      console.log("Connected to Quicknode WebSocket");

      const subscribeMsg = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: [
          "logs",
          {
            address: this.poolAddress,
            topics: [
              "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1", // Sync event
              "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822" // Swap event
            ]
          }
        ]
      };

      console.log("Sending subscription message:", JSON.stringify(subscribeMsg, null, 2));
      this.ws.send(JSON.stringify(subscribeMsg));
    });

    this.ws.on("message", (message: MessageEvent | string) => {
      try {
        console.log("Received message:", message);
        // Handle both MessageEvent objects and string messages
        const messageData = message instanceof MessageEvent ? message.data : message;
        // Check if the message is already an object
        const data = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
        if (data.params?.result) {
          this.handlePoolEvent(data.params.result);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    this.ws.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
    });

    this.ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  }

  private handlePoolEvent(event: PoolEvent) {
    try {
      // Determine event type from topic
      const eventTopic = event.topics[0];

      switch(eventTopic) {
        case "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1": // Sync
          this.handleSyncEvent(event);
          break;
        case "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822": // Swap
          this.handleSwapEvent(event);
          break;
        default:
          console.log(`Unknown event type: ${eventTopic}`);
      }
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }

  private handleSyncEvent(event: PoolEvent) {
    // Decode the Sync event data
    const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
      ['uint256', 'uint256'],
      event.data
    );

    // Format reserves to readable numbers
    const reserve0 = ethers.formatUnits(decodedData[0], 18);
    const reserve1 = ethers.formatUnits(decodedData[1], 18);

    // Calculate and print prices
    const price0Per1 = parseFloat(reserve1) / parseFloat(reserve0);
    const price1Per0 = parseFloat(reserve0) / parseFloat(reserve1);

    console.log(`
      === New Pool Event ===
      Pool Address: ${event.address}
      Transaction: ${event.transactionHash}
      Reserve0: ${reserve0}
      Reserve1: ${reserve1}
      Price (token1/token0): ${price0Per1.toFixed(8)}
      Price (token0/token1): ${price1Per0.toFixed(8)}
      Timestamp: ${new Date().toISOString()}
      ==================
    `);
  }

  private handleSwapEvent(event: PoolEvent) {
    const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
      ['uint256', 'uint256', 'uint256', 'uint256'],
      event.data
    );

    console.log(`
      === New Swap Event ===
      Pool Address: ${event.address}
      Transaction: ${event.transactionHash}
      Amount0In: ${ethers.formatUnits(decodedData[0], 18)}
      Amount1In: ${ethers.formatUnits(decodedData[1], 18)}
      Amount0Out: ${ethers.formatUnits(decodedData[2], 18)}
      Amount1Out: ${ethers.formatUnits(decodedData[3], 18)}
      Timestamp: ${new Date().toISOString()}
      ==================
    `);
  }
}

// Load .env file
await load({ export: true });

const QUICKNODE_WS_URL = Deno.env.get("QUICKNODE_WS_URL") || "";
const POOL_ADDRESS = Deno.env.get("POOL_ADDRESS") || "";

if (!QUICKNODE_WS_URL || !POOL_ADDRESS) {
  console.error("Please set QUICKNODE_WS_URL and POOL_ADDRESS in your .env file");
  Deno.exit(1);
}

const monitor = new PoolMonitor(QUICKNODE_WS_URL, POOL_ADDRESS);

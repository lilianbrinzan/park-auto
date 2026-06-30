import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Initialize server
const server = new Server(
  {
    name: "park-auto-details",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool schema
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_parking_details",
        description: "Returns premium secured parking details for Park Auto, including physical address and precise GPS coordinates.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Define tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "get_parking_details") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            name: "Park Auto - Premium Secured Parking",
            address: "str. Sfatul Țării 2, Chișinău, Republica Moldova",
            coordinates: {
              latitude: 47.02269,
              longitude: 28.81857
            },
            schedule: "Non-stop (24/7)",
            amenities: [
              "3D interactive lot layout check in browser",
              "Secure fencing & automated gating",
              "24/7 surveillance cameras",
              "Instant support communication"
            ]
          }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

// Run server using stdio
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Park Auto MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});

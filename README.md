# Nostr Reader

A simple Deno-based Nostr client that connects to a relay and displays real-time text posts (kind 1 events). This application demonstrates basic Nostr protocol implementation using WebSocket connections.

## Features

- Real-time connection to Nostr relay
- Subscribes to text posts (kind 1 events) only
- Displays posts with timestamps and truncated author public keys
- Graceful shutdown with Ctrl+C
- Clean WebSocket connection management

## Prerequisites

- [Deno](https://deno.land/) installed on your system
- Basic understanding of the Nostr protocol
- Internet connection to access the relay

## Installation

1. Clone this repository:
```bash
git clone https://github.com/keix/nostr-client.git
cd nostr-reader
```

2. Make sure you have Deno installed. If not, follow the [official installation guide](https://deno.land/#installation).

## Usage

Run the application with Deno:

```bash
deno run --allow-net main.ts
```

The `--allow-net` flag is required to allow WebSocket connections to the relay.

### Output Format

The application displays events in the following format:

```
-------------------
Time: [timestamp in local time]
Content: [post content]
Author: [first 8 characters of pubkey]...
```

### Termination

Press Ctrl+C to gracefully shut down the application. This will:
1. Unsubscribe from the relay
2. Close the WebSocket connection
3. Exit the program

## Configuration

The application uses the following default settings:

- Relay URL: `wss://relay.snort.social`
- Event Types: Kind 1 (text notes) only
- Subscription: Only shows posts created after the application starts

To modify these settings, edit the following constants in the code:

- `RELAY_URL`: Change the relay server
- `kinds` array in the `subscribe()` method: Modify event types to subscribe to
- `Filter` interface: Adjust subscription parameters

## Technical Details

### Dependencies

- WebSocket module: `deno.land/x/websocket@v0.1.4/mod.ts`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License, copyright (c) 2024 Kei Sawamura All rights reserved.

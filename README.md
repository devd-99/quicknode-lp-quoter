Pool Used: https://app.uniswap.org/explore/pools/arbitrum/0xC6962004f452bE9203591991D15f6b388e09E8D0

Stdout on running the program:

```
Connected to Quicknode WebSocket
Sending subscription message: {
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0xC6962004f452bE9203591991D15f6b388e09E8D0",
      "topics": [
        "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
        "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
      ]
    }
  ]
}
Received message: MessageEvent {
  bubbles: false,
  cancelable: false,
  composed: false,
  currentTarget: WebSocket {
    url: "wss://intensive-cool-shadow.arbitrum-mainnet.quiknode.pro/f452e0f5045c22e27882a7f88b5c910b65995dee",
    readyState: 1,
    extensions: "",
    protocol: "",
    binaryType: "blob",
    bufferedAmount: 0,
    onmessage: [Function (anonymous)],
    onerror: [Function (anonymous)],
    onclose: [Function (anonymous)],
    onopen: [Function (anonymous)]
  },
  defaultPrevented: false,
  eventPhase: 2,
  srcElement: null,
  target: WebSocket {
    url: "wss://intensive-cool-shadow.arbitrum-mainnet.quiknode.pro/f452e0f5045c22e27882a7f88b5c910b65995dee",
    readyState: 1,
    extensions: "",
    protocol: "",
    binaryType: "blob",
    bufferedAmount: 0,
    onmessage: [Function (anonymous)],
    onerror: [Function (anonymous)],
    onclose: [Function (anonymous)],
    onopen: [Function (anonymous)]
  },
  returnValue: true,
  timeStamp: 0,
  type: "message",
  data: '{"jsonrpc":"2.0","id":1,"result":"0xeb2983881494f3fc855c5fdb67e28caf"}\n',
  origin: "wss://intensive-cool-shadow.arbitrum-mainnet.quiknode.pro/f452e0f5045c22e27882a7f88b5c910b65995dee",
  lastEventId: ""
}
```

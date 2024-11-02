# FAM - Financial Agent Management

FAM is a comprehensive agent management system designed for financial agents that are onchain. Born from the need to efficiently manage Based Agents using the Coinbase Developer Platform SDK, Crossmint, OpenAI Swarm, FAM simplifies the complex process of deploying, monitoring, and managing multiple financial agents.

## Overview

We believe agent management systems have incredible moat and stickiness, similar to what Salesforce achieved with CRM and Amazon with AWS. With stablecoin payments exceeding 10T in transaction volume (80% processed by bots and agents), FAM addresses a critical need in the market.

### Key Features

- **Agent Deployment**: Deploy multiple financial agents with distinct strategies
- **LLM Integration**: Interact with agents via LLMs to understand or modify strategies
- **Onchain Credentials**: Verify agent identity with Crossmint
- **Risk-based Strategies**: Different strategies with different risk appetite

## Technical Stack

### Frontend
- **NextJS**: React framework for building the user interface
- **TailwindCSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript for better development experience

### Backend
- **Flask**: Python web framework for API endpoints
- **WebSocket**: Real-time communication between agents and frontend

### Blockchain Integration
- **CDP SDK**: Onchain agentic framework for smart contract interactions
- **Crossmint**: API credential management and verification
- **Aave Protocol**: DeFi lending and borrowing operations

### AI/ML
- **OpenAI Swarm**: LLM integration for agent communication
- **Custom Agents**: Specialized financial agents with different risk profiles:
  - Bearish Strategy (Conservative)
  - Bullish Strategy (Optimistic)
  - Moon Strategy (Aggressive)
  - Buffet Strategy (Value-focused)

## Current Features

1. **Agent Management**
   - Deploy multiple financial agents
   - Monitor agent status and transactions
   - View agent credentials and verification

2. **Strategy Execution**
   - USDC supply to liquidity pools
   - Multi-step lending strategies
   - Risk-based portfolio management

3. **Real-time Communication**
   - Chat interface with agents
   - Strategy explanation and modification
   - Transaction status updates

## Future Roadmap

- Payment agents that can be deployed to send payments / airdrops to users
- Advanced investment strategies with other DeFi protocols
- Lending health (LTV) monitoring
- Better agent error handling and training

## Getting Started

1. Install dependencies
```
npm install
pip install -r requirements.txt
```

2. Set the environment variables required in. .env. Find a template in .env.example


3. Start the application
```
npm run dev
```



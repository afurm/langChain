# Language Courses on Chain

A decentralized language learning platform built on Moonbeam blockchain with AI-powered content generation.

## Features

- 🔗 Fully on-chain data storage via Moonbeam blockchain
- 🤖 AI-generated lessons and quizzes using OpenAI
- 🎮 Gamified learning experience with token rewards
- 🔒 Secure wallet-based authentication
- 📱 Responsive modern UI built with Next.js and Tailwind CSS

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Blockchain: Moonbeam Network (EVM compatible)
- Smart Contracts: Solidity
- AI: OpenAI API
- Web3 Libraries: ethers.js

## Prerequisites

- Node.js 18.x or later
- MetaMask or another Web3 wallet with Moonbeam network configured
- OpenAI API key for content generation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/language-courses-on-chain.git
cd language-courses-on-chain
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_MOONBEAM_RPC_URL=your_moonbeam_rpc_url
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── contracts/        # Solidity smart contracts
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── styles/          # Global styles and Tailwind config
└── types/           # TypeScript type definitions
```

## Smart Contracts

The project uses the following main smart contracts:

- UserProfile: Manages user data and progress
- LessonManager: Handles lesson completion and progress tracking
- TokenRewards: Controls the token reward system

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

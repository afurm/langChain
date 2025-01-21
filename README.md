# Language Courses on Chain 🌐

A decentralized platform for language learning that combines Web3 technology with interactive education. Built with Next.js, Tailwind CSS, and Moonbeam blockchain integration.

🔗 **[Live Platform](https://lang-chain-ivory.vercel.app/)**

## Platform Statistics 📊

- **1000+** Active Learners
- **50+** AI-Generated Lessons
- **10k+** Rewards Earned
- **4.9** User Rating

## Features 🚀

- **Interactive Lessons**: Engaging language lessons with various quiz types
  - Multiple Choice Questions
  - Fill in the Blanks
  - Speaking Practice
  - Matching Exercises
  - Reordering Tasks
  - Cloze Passages

- **Web3 Integration** 🔗
  - Progress tracking on-chain
  - Token rewards for completing lessons
  - Achievement NFTs
  - Decentralized content storage using IPFS

- **User Experience** 💫
  - Responsive design for all devices
  - Beautiful UI with smooth animations
  - Real-time feedback
  - Progress tracking
  - Achievement system

## How It Works 🎯

1. **Connect Wallet**: Link your Web3 wallet to begin your personalized learning experience
2. **Choose Lessons**: Select from AI-generated lessons perfectly tailored to your skill level
3. **Earn Rewards**: Complete lessons to earn tokens and track your progress on-chain

## Tech Stack 🛠️

- **Frontend**:
  - Next.js 14 (App Router)
  - TailwindCSS
  - Framer Motion
  - ConnectKit
  - wagmi

- **Blockchain**:
  - Moonbeam/Moonbase Alpha
  - Solidity Smart Contracts
  - OpenZeppelin Contracts

- **Storage**:
  - IPFS for lesson content
  - Local storage for progress caching

## Getting Started 🏁

1. Clone the repository:
```bash
git clone https://github.com/yourusername/language-courses-on-chain.git
cd language-courses-on-chain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your environment variables:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_MOONBEAM_RPC_URL`
- `NEXT_PUBLIC_MOONBASE_RPC_URL`
- `OPENAI_API_KEY` (for content generation)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contracts 📝

The project uses the following main contracts:

- `LessonManager.sol`: Manages lesson content and completion tracking
- `UserProfile.sol`: Handles user progress and achievements
- `Achievement.sol`: NFT contract for achievement badges

## Resources 📚

- [Documentation](https://lang-chain-ivory.vercel.app/docs)
- [FAQs](https://lang-chain-ivory.vercel.app/faqs)
- [Community](https://lang-chain-ivory.vercel.app/community)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

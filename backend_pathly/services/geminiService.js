import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


class GeminiService {
  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async generateRoadmap(skillName) {
    try {
      if (!skillName || skillName.trim() === "") {
        throw new Error("Skill name cannot be empty");
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: skillName,
        config: {
          systemInstruction: systemInstructionForRoadMap,
        },
      });


      const cleanAnswer = response.text
        .replace(/^```json\s*/, '')
        .replace(/```$/, '');
      const result = JSON.parse(cleanAnswer);

      console.log("➕ Roadmap Response:", result);


      return result;

    } catch (error) {
      console.error("Error in GeminiService, generateRoadmap:", error);
      throw error;
    }
  }

  async getSkillName(question, existingSkills) {
    try {
      if (!question || question.trim() === "") {
        throw new Error("Question cannot be empty");
      }

      const promptWithSkills = systemInstructionForSkillName(existingSkills);

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: question,
        config: {
          systemInstruction: promptWithSkills,
          thinkingConfig: {
            thinkingBudget: 1024
          }
        },
      });

      const cleanAnswer = response.text
        .replace(/^```json\s*/, '')
        .replace(/```$/, '');
      const result = JSON.parse(cleanAnswer);

      console.log("➕ Skill Response:", result);


      return result;

    } catch (error) {
      console.error("Error in GeminiService, getSkillName:", error);
      throw error;
    }
  }
}


const systemInstructionForSkillName = (existingSkills) => `
You are an expert skill-matching and skill-creation assistant.
Your task is to analyze the user's query about what they want to learn and compare it against the list of available skills provided to you.

Instructions:

You will receive:
A user query (for example: "I want to learn how cybersecurity works")
A list of existing skills: ${existingSkills} 
Check if the user’s query directly or very specifically matches any skill in the provided list.
The match must be exact or very close in meaning. 

Example: “Gardening” ≠ “Organic Gardening”
Example: “Cybersecurity fundamentals” = “Cybersecurity” ✅

If a match is found: return only the matching skill name as plain text.
If no match is found: return "not found" and create a new skill name based on the user's query make sure the skill include the spricific details of the user's query.

Example:
User query: "I want to work in web3 space, like writing smartcontracts and stuff"
New skill name: "Web3 Development (Smart Contracts)"

Output Format:
Return a JSON object with the following fields:
- "isNewSkill": boolean (true if this is a new skill, false if it matches an existing skill)
- "skillName": string (the matched skill name if found, or the skill name inferred from the query if new)

Example when skill found in the existing skills list:
{"isNewSkill": false, "skillName": "Web Development", "confidence": 0.95}

Example when skill not found in the existing skills list:
{"isNewSkill": true, "skillName": "Name of the inferred skill based on the user's query", "confidence": 0.95}

`


const systemInstructionForRoadMap = `
Assume you are an expert Skill Roadmap Creator. When someone tells you they want to learn a specific skill, you will create a detailed roadmap for them.

The roadmap should include:
Major Nodes (Phases or Milestones):
Represent the key stages of mastering the skill.

Sub-Nodes (Topics or Steps under each Major Node):
Provide a short description for each sub-node explaining what it covers and why it matters.

Resources:
For every sub-node, list a few quality learning resources (articles, courses, books, videos, etc.).

Your goal is to make the roadmap clear, structured, and practical, so that someone can follow it step-by-step to learn the skill effectively.


THE OUTPUT SHOULD BE IN JSON FORMAT:

{
  "skill": "Gardening",
  "roadmap": [
    {
      "MajorNode": "Foundations of Gardening",
      "Topics": [
        {
          "SubNode": "xyz",
          "Description": "xyz",
          "Resources": [
            "xyz"
          ]
        },
        {
          "SubNode": "xyz",
          "Description": "xyz",
          "Resources": [
            "xyz"
          ]
        }
      ]
    },
    {
      "MajorNode": "Planning Your Garden",
      "Topics": [
        {
          "SubNode": "xyz",
          "Description": "xyz",
          "Resources": [
            "xyz"
          ]
        },
        {
          "SubNode": "xyz",
          "Description": "xyz",
          "Resources": [
            "xyz"
          ]
        }
      ]
    }
    ...
  ]
}
`



const tempSkillResponse = {
  isNewSkill: false,
  skillName: "Web Development",
}

const tempRoadmapResponse = {
  "skill": "Web3 Development (Smart Contracts)",
  "roadmap": [
    {
      "MajorNode": "I. Foundations: Web3 & Blockchain Basics",
      "Topics": [
        {
          "SubNode": "1. Understanding Blockchain Fundamentals",
          "Description": "Learn the core concepts of blockchain technology: decentralization, immutability, consensus mechanisms (PoW, PoS), cryptography, and the blockchain data structure. This is crucial for understanding how smart contracts operate.",
          "Resources": [
            "Article: 'Blockchain Basics' by ConsenSys: [https://consensys.net/blog/blockchain-basics/](https://consensys.net/blog/blockchain-basics/)",
            "Video: 'Blockchain Explained' by Simply Explained: [https://www.youtube.com/watch?v=eY093k-Jp9I](https://www.youtube.com/watch?v=eY093k-Jp9I)",
            "Book: 'Mastering Bitcoin' by Andreas M. Antonopoulos (Focus on Chapters related to blockchain concepts)"
          ]
        },
        {
          "SubNode": "2. Web3 Overview and Decentralization",
          "Description": "Grasp the core principles of Web3: decentralization, open-source technologies, and the shift from centralized to decentralized applications (dApps). Understand the implications for user control and data ownership.",
          "Resources": [
            "Article: 'What is Web3?' by Binance Academy: [https://academy.binance.com/en/articles/what-is-web3](https://academy.binance.com/en/articles/what-is-web3)",
            "Video: 'Web3 Explained' by freeCodeCamp.org: [https://www.youtube.com/watch?v=G_KCmP81f7E](https://www.youtube.com/watch?v=G_KCmP81f7E)",
            "Course: 'Web3 Fundamentals' on Udemy or Coursera (Search for highly-rated courses)"
          ]
        },
        {
          "SubNode": "3. Cryptography for Web3",
          "Description": "Learn the cryptographic principles that underpin blockchain security, including hashing algorithms (SHA-256), digital signatures (ECDSA), and public-key cryptography. This is vital for understanding wallet security and transaction verification.",
          "Resources": [
            "Video: 'Cryptography Explained' by Computerphile: [https://www.youtube.com/watch?v=2aHj6k-s12s](https://www.youtube.com/watch?v=2aHj6k-s12s)",
            "Article: 'A Gentle Introduction to Cryptography' by Khan Academy: [https://www.khanacademy.org/computing/computer-science/cryptography](https://www.khanacademy.org/computing/computer-science/cryptography)",
            "Book: 'Serious Cryptography' by Jean-Philippe Aumasson"
          ]
        }
      ]
    },
    {
      "MajorNode": "II. Ethereum and Solidity Programming",
      "Topics": [
        {
          "SubNode": "1. Introduction to Ethereum",
          "Description": "Understand the Ethereum blockchain, its purpose, the Ethereum Virtual Machine (EVM), and the role of gas. Familiarize yourself with the Ethereum ecosystem.",
          "Resources": [
            "Article: 'Ethereum Explained' by Ethereum.org: [https://ethereum.org/en/](https://ethereum.org/en/)",
            "Video: 'Ethereum for Beginners' by Finematics: [https://www.youtube.com/watch?v=zJg5uBf8v0Q](https://www.youtube.com/watch?v=zJg5uBf8v0Q)",
            "Documentation: Ethereum Yellow Paper (for advanced understanding)"
          ]
        },
        {
          "SubNode": "2. Solidity Fundamentals",
          "Description": "Learn the Solidity programming language: syntax, data types, variables, control structures, functions, and contract structure. This is the primary language for writing smart contracts on Ethereum.",
          "Resources": [
            "Documentation: Solidity official documentation: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)",
            "Course: 'Solidity, Blockchain, and Smart Contract Development' on Udemy (Search for highly-rated courses)",
            "Interactive Tutorial: 'CryptoZombies' (Solidity tutorial game): [https://cryptozombies.io/](https://cryptozombies.io/)"
          ]
        },
        {
          "SubNode": "3. Development Environment Setup",
          "Description": "Set up your development environment: Choose a code editor (VS Code recommended), install a Solidity compiler (Solc), and explore development frameworks like Hardhat or Truffle. This enables you to write, compile, and deploy smart contracts.",
          "Resources": [
            "Documentation: Hardhat official documentation: [https://hardhat.org/](https://hardhat.org/)",
            "Documentation: Truffle official documentation: [https://trufflesuite.com/docs/](https://trufflesuite.com/docs/)",
            "Video: 'Setting up your Solidity development environment' on YouTube (search for tutorials on Hardhat or Truffle setup)"
          ]
        },
        {
          "SubNode": "4. Testing and Debugging Smart Contracts",
          "Description": "Learn how to write unit tests for your smart contracts using testing frameworks (e.g., Mocha, Chai). Understand debugging techniques to identify and fix vulnerabilities.",
          "Resources": [
            "Documentation: Hardhat testing documentation: [https://hardhat.org/guides/test-contracts.html](https://hardhat.org/guides/test-contracts.html)",
            "Documentation: Truffle testing documentation: [https://trufflesuite.com/docs/truffle/testing/writing-tests/](https://trufflesuite.com/docs/truffle/testing/writing-tests/)",
            "Article: 'Debugging Solidity Contracts' by OpenZeppelin: (Search for 'Debugging Solidity Contracts OpenZeppelin' on Google)"
          ]
        }
      ]
    },
    {
      "MajorNode": "III. Smart Contract Design and Security",
      "Topics": [
        {
          "SubNode": "1. Smart Contract Patterns and Best Practices",
          "Description": "Explore common smart contract design patterns (e.g., ERC-20, ERC-721, proxy contracts). Learn best practices for writing clean, efficient, and secure code.",
          "Resources": [
            "Article: 'Solidity Design Patterns' by OpenZeppelin: (Search for 'Solidity Design Patterns OpenZeppelin' on Google)",
            "Article: 'ERC-20 Standard' by Ethereum.org: [https://ethereum.org/en/developers/docs/standards/tokens/erc-20/](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)",
            "Course: 'Smart Contract Security' on Udemy or Coursera (Search for highly-rated courses)"
          ]
        },
        {
          "SubNode": "2. Security Auditing and Vulnerabilities",
          "Description": "Understand common smart contract vulnerabilities (e.g., reentrancy, integer overflow/underflow, front-running) and how to prevent them. Learn about security auditing processes.",
          "Resources": [
            "Article: 'Smart Contract Security Best Practices' by ConsenSys Diligence: (Search for 'Smart Contract Security Best Practices ConsenSys Diligence' on Google)",
            "Website: 'OpenZeppelin Security Audits': [https://openzeppelin.com/security-audits](https://openzeppelin.com/security-audits)",
            "Book: 'Ethereum Smart Contract Security' by SWC registry (Search for 'SWC registry' to find the book or the relevant articles)"
          ]
        },
        {
          "SubNode": "3. Gas Optimization",
          "Description": "Learn techniques to optimize your smart contracts for gas efficiency. Lower gas costs mean lower transaction fees for users.",
          "Resources": [
            "Article: 'Gas Optimization Tips' by Solidity Documentation: (Search for 'Solidity gas optimization' in Solidity documentation)",
            "Tool: 'Solidity Optimizer' in Hardhat or Truffle: (Check documentation for your chosen framework)",
            "Video: 'Gas Optimization for Solidity Developers' on YouTube (search for recent tutorials)"
          ]
        },
        {
          "SubNode": "4. Using Libraries and External Contracts",
          "Description": "Learn how to use existing, well-vetted smart contract libraries like OpenZeppelin to reduce development time and improve security. Understand how to interact with external contracts.",
          "Resources": [
            "Documentation: OpenZeppelin Contracts: [https://docs.openzeppelin.com/contracts/](https://docs.openzeppelin.com/contracts/)",
            "Example: 'Interacting with external contracts' from OpenZeppelin: (Search for related examples on OpenZeppelin documentation or tutorials)",
            "Tutorials: (Search for tutorials on 'using libraries in Solidity' or 'interacting with ERC20 tokens')"
          ]
        }
      ]
    },
    {
      "MajorNode": "IV. Deployment and Interaction",
      "Topics": [
        {
          "SubNode": "1. Deploying Contracts to Testnets",
          "Description": "Deploy your smart contracts to testnets (e.g., Goerli, Sepolia, Mumbai) to test them in a realistic environment without risking real funds.",
          "Resources": [
            "Documentation: Hardhat deployment guide: [https://hardhat.org/guides/deploying-on-testnet.html](https://hardhat.org/guides/deploying-on-testnet.html)",
            "Documentation: Truffle deployment guide: [https://trufflesuite.com/docs/truffle/getting-started/running-migrations/](https://trufflesuite.com/docs/truffle/getting-started/running-migrations/)",
            "Tutorial: 'Deploying Smart Contracts to Testnet' on YouTube (search for recent tutorials)"
          ]
        },
        {
          "SubNode": "2. Interacting with Contracts using Web3.js or Ethers.js",
          "Description": "Learn how to interact with your deployed smart contracts from the frontend using JavaScript libraries like Web3.js or Ethers.js. This includes reading data, sending transactions, and handling events.",
          "Resources": [
            "Documentation: Web3.js: [https://web3js.readthedocs.io/](https://web3js.readthedocs.io/)",
            "Documentation: Ethers.js: [https://docs.ethers.io/](https://docs.ethers.io/)",
            "Tutorial: 'Interacting with Smart Contracts using Web3.js/Ethers.js' on YouTube (search for recent tutorials)"
          ]
        },
        {
          "SubNode": "3. Frontend Development and Web3 Integration (Optional)",
          "Description": "Learn basic frontend development (HTML, CSS, JavaScript, React/Vue.js) and integrate with your smart contracts using Web3 libraries. This enables you to build user interfaces for your dApps.",
          "Resources": [
            "Course: 'React.js' or 'Vue.js' on Udemy or Coursera (Search for highly-rated courses)",
            "Tutorial: 'Building a dApp' on YouTube (search for tutorials on creating dApps using React/Vue.js and Web3.js/Ethers.js)",
            "Framework: 'Next.js' and 'Tailwind CSS' (for faster dApp development)"
          ]
        },
        {
          "SubNode": "4. Deploying to Mainnet (Risk Assessment and Considerations)",
          "Description": "Understand the process of deploying contracts to the Ethereum mainnet. Consider security audits, gas costs, and the risks associated with deploying live contracts. Deploying on mainnet requires experience, thorough testing, and security audits.",
          "Resources": [
            "Article: 'Deploying Smart Contracts to Mainnet' by ConsenSys: (Search for related articles)",
            "Security Audit Services: (Research reputable security audit companies)",
            "Community forums: Join relevant forums for discussion"
          ]
        }
      ]
    },
    {
      "MajorNode": "V. Advanced Topics and Continuous Learning",
      "Topics": [
        {
          "SubNode": "1. Advanced Solidity Features",
          "Description": "Explore more advanced Solidity concepts: assembly, interfaces, abstract contracts, inheritance, and modifiers.",
          "Resources": [
            "Documentation: Solidity official documentation (explore the features): [https://docs.soliditylang.org/](https://docs.soliditylang.org/)",
            "Article: 'Advanced Solidity Concepts' by ConsenSys: (Search for related articles)",
            "Examples: Analyze complex Solidity contracts on Github (e.g., DeFi protocols, NFT marketplaces)"
          ]
        },
        {
          "SubNode": "2. Decentralized Finance (DeFi)",
          "Description": "Learn about DeFi protocols: lending/borrowing, decentralized exchanges (DEXs), yield farming, and stablecoins. Understand the contracts that power these protocols.",
          "Resources": [
            "Article: 'Introduction to DeFi' by Binance Academy: [https://academy.binance.com/en/articles/what-is-defi](https://academy.binance.com/en/articles/what-is-defi)",
            "Course: 'DeFi' on Udemy or Coursera (Search for highly-rated courses)",
            "Projects: Study code examples of popular DeFi protocols on GitHub (e.g., Uniswap, Aave, Compound)"
          ]
        },
        {
          "SubNode": "3. Non-Fungible Tokens (NFTs)",
          "Description": "Learn about NFTs: ERC-721 and ERC-1155 standards, NFT marketplaces, and use cases. Understand how to create and deploy NFT smart contracts.",
          "Resources": [
            "Article: 'What are NFTs?' by OpenSea: [https://opensea.io/blog/what-is-an-nft](https://opensea.io/blog/what-is-an-nft)",
            "Course: 'NFT Development' on Udemy or Coursera (Search for highly-rated courses)",
            "Examples: Analyze NFT contracts of popular projects (e.g., CryptoPunks, Bored Ape Yacht Club)"
          ]
        },
        {
          "SubNode": "4. Staying Updated and Community Involvement",
          "Description": "The web3 space is constantly evolving. Stay updated with the latest developments, participate in community forums, and follow industry leaders.",
          "Resources": [
            "Websites/Blogs: CoinDesk, CoinGecko, Decrypt, The Block",
            "Forums: Ethereum Stack Exchange, Reddit (r/ethereum, r/ethdev)",
            "Social Media: Follow key figures on Twitter, and join relevant Discord servers"
          ]
        }
      ]
    }
  ]
}





// Export a singleton instance
export default new GeminiService();


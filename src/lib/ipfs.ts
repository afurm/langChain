import { create } from 'ipfs-http-client';
import { LessonContent } from './openai';

// Configure IPFS client to use Infura's IPFS gateway
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
    ).toString('base64')}`,
  },
});

export async function uploadToIPFS(content: LessonContent): Promise<string> {
  try {
    const result = await ipfs.add(JSON.stringify(content));
    return result.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload content to IPFS');
  }
}

export async function getFromIPFS(hash: string): Promise<LessonContent> {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString();
    return JSON.parse(content) as LessonContent;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch content from IPFS');
  }
} 
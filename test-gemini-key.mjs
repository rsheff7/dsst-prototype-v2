import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/GEMINI_API_KEY=(.+)/);

if (!match) {
  console.error('No GEMINI_API_KEY found in .env.local');
  process.exit(1);
}

const apiKey = match[1].trim();
console.log('API Key found:', apiKey.substring(0, 8) + '...');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

try {
  const result = await model.generateContent('Say "hello" and nothing else.');
  const response = result.response.text();
  console.log('Response:', response);
  console.log('\n✅ Gemini API key is valid.');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
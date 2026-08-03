import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('No GEMINI_API_KEY in environment');
  process.exit(1);
}

console.log('Testing Gemini API key:', apiKey.substring(0, 10) + '...');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

try {
  const result = await model.generateContent('Say "hello" and nothing else.');
  const text = result.response.text();
  console.log('Response:', text);
  console.log('\n✅ Gemini API key is valid.');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
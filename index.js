import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({});
const sessions = new Map();

async function transformQuery(question, history) {
  const tempHistory = [...history, {
    role: 'user',
    parts: [{ text: question }]
  }];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: tempHistory,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
Only output the rewritten question and nothing else.`,
    },
  });

  return response.text;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { question, sessionId } = req.body;

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    const history = sessions.get(sessionId);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });

    const query = await transformQuery(question, history);
    const queryVector = await embeddings.embedQuery(query);

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map(match => match.metadata.text)
      .join("\n\n---\n\n");

    history.push({
      role: 'user',
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: history,
      config: {
        systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
You will be given a context of relevant information and a user question.
Your task is to answer the user's question based ONLY on the provided context.
If the answer is not in the context, you must say "I am a DSA agent created by Abhijeet Singh Rawat on RAG modal using Pinecone DB and Langchain framework.
I can just help you with DSA query only. Please don't ask me any irrelevant question. I hope you will cooperate with me next time."
Keep your answers clear, concise, and educational.

Context: ${context}`,
      },
    });

    history.push({
      role: 'model',
      parts: [{ text: response.text }]
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';


async function indexDocument (){

    //STEP 1: LOAD THE DOCUMENT TO THE PROGRAM

    const PDF_PATH = './dsa.pdf';
const pdfLoader = new PDFLoader(PDF_PATH);
const rawDocs = await pdfLoader.load();

console.log("document loaded")

// console.log(JSON.stringify(rawDocs, null, 2));
console.log(rawDocs.length)

//STEP 2: DIVIDE THE PROGRAM INTO CHUNKS
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

console.log("chunking done")
// console.log(JSON.stringify(chunkedDocs.slice(0, 2), null, 2));
console.log(chunkedDocs.length)

//STEP 3: EMBEDD THE DATA
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });

  console.log("data embedding configured")
  //STEP 4: SETUP THE DATABASE
  const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

console.log("db setup")

//STEP 5 : EMBEDD THE CHUNKS TO THE DATA BASE
await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

console.log("data loaded")

}

indexDocument();


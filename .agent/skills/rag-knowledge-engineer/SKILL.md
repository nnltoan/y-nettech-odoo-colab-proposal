---
description: Build Knowledge Graphs from unstructured docs, set up mini-RAG systems, and optimize context for LLMs.
---

# RAG Knowledge Engineer Skill

## Purpose
This skill serves Round 2 of the competition. It focuses on converting unstructured documentation (PDFs, Markdown, Wikis) into structured Knowledge Graphs (KG) and setting up Retrieval-Augmented Generation (RAG) pipelines.

## 1. Data Ingestion & Chunking
- **Source Analysis**: Identify document structure (headers, tables, code blocks).
- **Chunking Strategy**:
    - *Semantic Chunking*: Break text by topic or section rather than arbitrary character limits.
    - *Overlapping*: Mantain context between chunks (e.g., 50-token overlap).

### Actions:
- creating scripts to parse and chunk text files.
- extract specific entities (Product Names, Error Codes, API Methods) for metadata tagging.

## 2. Knowledge Graph Construction (Mini-Graph)
- **Node Definition**: Define what objects exist (e.g., `Class`, `Service`, `Requirement`, `Module`).
- **Edge Definition**: Define relationships (e.g., `Class A` *calls* `Class B`, `Requirement X` *is implemented by* `Module Y`).

### Actions:
- Represent the graph using simple JSON/YAML structures or a dedicated graph DB if available (Neo4j, Memgraph).
- Visualize the graph to verify relationships.

## 3. RAG Setup (Retrieval)
- **Embedding**: Convert meaningful text chunks into vectors (using local embeddings or API).
- **Indexing**: Store vectors for fast similarity search.
- **Retrieval Logic**:
    - *Hybrid Search*: Combine keyword search (BM25) with vector search (Cosine Similarity).
    - *Reranking*: Re-order top results based on direct relevance to the query.

## 4. QnA System Implementation
- **Context Construction**: dynamically assemble prompts including the retrieved context.
- **Answer Generation**: Use an LLM to answer user queries based *strictly* on the provided context (reduce hallucinations).

## 5. Verification
- Test with "Golden Questions": A set of queries with known correct answers.
- Measure Hallucination Rate: Ensure answers don't invent facts not present in source docs.

---
name: embedding-strategies
description: Guide to selecting and optimizing embedding models for vector search applications.
---

# Embedding Strategies

## Core Concepts

### 1. Embedding Model Comparison
| Model | Dimensions | Max Tokens | Best For |
|-------|------------|------------|----------|
| **text-embedding-3-large** | 3072 | 8191 | High accuracy |
| **text-embedding-3-small** | 1536 | 8191 | Cost-effective |
| **voyage-2** | 1024 | 4000 | Code, legal |
| **bge-large-en-v1.5** | 1024 | 512 | Open source |
| **all-MiniLM-L6-v2** | 384 | 256 | Fast, lightweight |
| **multilingual-e5-large** | 1024 | 512 | Multi-language |

### 2. Embedding Pipeline
```
Document → Chunking → Preprocessing → Embedding Model → Vector
                ↓
        [Overlap, Size]  [Clean, Normalize]  [API/Local]
```

## Templates

### Template 1: OpenAI Embeddings
```python
from openai import OpenAI
from typing import List

client = OpenAI()

def get_embeddings(
    texts: List[str],
    model: str = "text-embedding-3-small",
    dimensions: int = None
) -> List[List[float]]:
    """Get embeddings from OpenAI."""
    batch_size = 100
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        kwargs = {"input": batch, "model": model}
        if dimensions:
            kwargs["dimensions"] = dimensions

        response = client.embeddings.create(**kwargs)
        embeddings = [item.embedding for item in response.data]
        all_embeddings.extend(embeddings)

    return all_embeddings
```

### Template 2: Local Embeddings with Sentence Transformers
```python
from sentence_transformers import SentenceTransformer
import numpy as np

class LocalEmbedder:
    def __init__(self, model_name: str = "BAAI/bge-large-en-v1.5", device: str = "cuda"):
        self.model = SentenceTransformer(model_name, device=device)

    def embed(self, texts: List[str], normalize: bool = True) -> np.ndarray:
        return self.model.encode(texts, normalize_embeddings=normalize, convert_to_numpy=True)

    def embed_query(self, query: str) -> np.ndarray:
        if "bge" in str(type(self.model)):
            query = f"Represent this sentence for searching relevant passages: {query}"
        return self.embed([query])[0]
```

### Template 3: Chunking Strategies
```python
from typing import List
import re

def chunk_by_tokens(text: str, chunk_size: int = 512, chunk_overlap: int = 50) -> List[str]:
    """Chunk text by token count."""
    import tiktoken
    tokenizer = tiktoken.get_encoding("cl100k_base")
    tokens = tokenizer.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = start + chunk_size
        chunk_tokens = tokens[start:end]
        chunks.append(tokenizer.decode(chunk_tokens))
        start = end - chunk_overlap
    return chunks

def chunk_by_sentences(text: str, max_chunk_size: int = 1000) -> List[str]:
    """Chunk text by sentences, respecting size limits."""
    import nltk
    sentences = nltk.sent_tokenize(text)
    chunks, current_chunk, current_size = [], [], 0
    for sentence in sentences:
        if current_size + len(sentence) > max_chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk, current_size = [], 0
        current_chunk.append(sentence)
        current_size += len(sentence)
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

def recursive_character_splitter(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """LangChain-style recursive splitter."""
    separators = ["\n\n", "\n", ". ", " ", ""]
    # Implementation follows LangChain pattern
    pass
```

### Template 4: Domain-Specific Embedding Pipeline
```python
class DomainEmbeddingPipeline:
    def __init__(self, embedding_model: str = "text-embedding-3-small", chunk_size: int = 512):
        self.embedding_model = embedding_model
        self.chunk_size = chunk_size

    def _default_preprocess(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        return text.strip()

    async def process_documents(self, documents: List[dict]) -> List[dict]:
        processed = []
        for doc in documents:
            cleaned = self._default_preprocess(doc["content"])
            chunks = chunk_by_tokens(cleaned, self.chunk_size)
            embeddings = get_embeddings(chunks, self.embedding_model)
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                processed.append({
                    "id": f"{doc['id']}_chunk_{i}",
                    "text": chunk,
                    "embedding": embedding
                })
        return processed
```

### Template 5: Embedding Quality Evaluation
```python
import numpy as np

def evaluate_retrieval_quality(queries, relevant_docs, retrieved_docs, k: int = 10) -> dict:
    """Evaluate embedding quality for retrieval."""
    def precision_at_k(relevant: set, retrieved: List[str], k: int) -> float:
        return len(set(retrieved[:k]) & relevant) / k

    def recall_at_k(relevant: set, retrieved: List[str], k: int) -> float:
        return len(set(retrieved[:k]) & relevant) / len(relevant) if relevant else 0

    def mrr(relevant: set, retrieved: List[str]) -> float:
        for i, doc in enumerate(retrieved):
            if doc in relevant:
                return 1 / (i + 1)
        return 0

    metrics = {f"precision@{k}": [], f"recall@{k}": [], "mrr": []}
    for relevant, retrieved in zip(relevant_docs, retrieved_docs):
        relevant_set = set(relevant)
        metrics[f"precision@{k}"].append(precision_at_k(relevant_set, retrieved, k))
        metrics[f"recall@{k}"].append(recall_at_k(relevant_set, retrieved, k))
        metrics["mrr"].append(mrr(relevant_set, retrieved))
    return {name: np.mean(values) for name, values in metrics.items()}
```

## Best Practices

### Do's
- **Match model to use case** - Code vs prose vs multilingual
- **Chunk thoughtfully** - Preserve semantic boundaries
- **Normalize embeddings** - For cosine similarity
- **Batch requests** - More efficient than one-by-one
- **Cache embeddings** - Avoid recomputing

### Don'ts
- **Don't ignore token limits** - Truncation loses info
- **Don't mix embedding models** - Incompatible spaces
- **Don't skip preprocessing** - Garbage in, garbage out
- **Don't over-chunk** - Lose context

import torch
import pinecone
from transformers import AutoTokenizer, AutoModel
import os
import dotenv

dotenv.load_dotenv()

pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))

# Load the pre-trained language model and tokenizer
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Define a text string to encode
text = "Hello, world!"

# Encode the text string as a vector
input_ids = tokenizer.encode(text, return_tensors="pt")
with torch.no_grad():
    vector = model(input_ids)[0][0]

# Add the vector to Pinecone
pinecone_index = "kex23"
pinecone_index.upsert("hello", vector)

# Disconnect from Pinecone
pinecone.deinit()

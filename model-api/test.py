import pinecone
import pinecone.info
import os
import dotenv
import tensorflow_hub as hub


dotenv.load_dotenv()
key = os.getenv("PINECONE_API_KEY")

pinecone.init(api_key=key, environment='us-west4-gcp')

index = pinecone.Index(index_name="kex23")

print(index.describe_index_stats())
from fastapi import FastAPI

app = FastAPI(title="QueueLess ML API")


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "QueueLess ML API is running",
    }

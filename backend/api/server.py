import uvicorn

def run_server():
    """Run the API server using Uvicorn"""
    uvicorn.run(
        "api.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    run_server()
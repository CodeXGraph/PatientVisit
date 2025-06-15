#!/usr/bin/env python3

# Import the FastAPI app from app.py
from api.app import app



# This file serves as the entry point for the FastAPI application
# The app instance is imported from app.py and used by uvicorn
# No additional configuration is needed here, as everything is set up in app.py

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)

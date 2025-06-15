#!/bin/bash

echo "Setting up debugging environment..."

# Ensure .venv-debug exists
if [ ! -d "/workspace/.venv-debug" ]; then
    echo "Creating virtual environment for debugging..."
    python -m venv /workspace/.venv-debug
    
    echo "Installing dependencies in debug environment..."
    /workspace/.venv-debug/bin/pip install --upgrade pip
    /workspace/.venv-debug/bin/pip install -r /workspace/docker/requirements.txt
    /workspace/.venv-debug/bin/pip install fastapi uvicorn gunicorn debugpy
    /workspace/.venv-debug/bin/pip install -e .
    
    echo "Installing spaCy and language model..."
    /workspace/.venv-debug/bin/pip install spacy
    /workspace/.venv-debug/bin/python -m spacy download en_core_web_sm
fi

echo "Creating debug runner script..."
cat > /workspace/debug_fastapi.py << EOL
"""
Debug entry point for FastAPI application
Run this script to start the FastAPI server in debug mode
"""
import debugpy
import os
import sys

# Setup debugpy
debugpy.listen(("0.0.0.0", 5678))
print("⚡️ VS Code debugger can now be attached, press F5 in VS Code ⚡️")
print("➡️ Use the 'Backend: FastAPI (Container)' launch configuration")
print("⏳ Waiting for debugger to attach...")
debugpy.wait_for_client()
print("🔗 Debugger attached!")

# Update path to include workspace
sys.path.insert(0, "/workspace")

# Import and run the FastAPI app
from uvicorn.core.run import run
run(app="api.main:app", host="0.0.0.0", port=8000, reload=True)
EOL

echo "Debug setup complete!"
echo 
echo "To start debugging:"
echo "1. Open VS Code's Run and Debug panel (Ctrl+Shift+D)"
echo "2. Start the debug script using the terminal command below"
echo "3. Select 'Backend: FastAPI (Container)' and press F5 to attach debugger"
echo
echo "Command to start debugging:"
echo "/workspace/.venv-debug/bin/python /workspace/debug_fastapi.py"
echo
echo "Happy debugging! 🐛"

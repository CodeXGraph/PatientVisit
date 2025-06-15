# Patient Visit Summarizer

A cross-platform application that creates patient visit summaries from voice recordings of doctor-patient conversations.

## Features

- **Modern Web-Based Interface**: Responsive design works on macOS, iPads, and mobile devices
- **Advanced Audio Processing**: Noise cancellation and voice isolation for clear audio capture
- **Medical-Focused Speech Recognition**: Uses domain-specific models fine-tuned on medical vocabulary
- **Medical Entity Recognition**: Identifies medical terms, diagnoses, medications, and procedures
- **Structured Summaries**: Generates organized clinical summaries from conversations
- **HIPAA Compliance**: Implements encryption and secure storage for patient data
- **Multi-Tier Architecture**: React frontend, FastAPI backend, and model processing layer
- **Docker Containerization**: Runs in isolated containers for development and deployment

## Quick Start

```bash
# Clone the repository
git clone https://github.com/chandru-b/patientvisit.git
cd patientvisit

# Run with Docker (recommended for first-time users)
docker-compose up --build

# Access the application at http://localhost:3000
```

## Requirements

- Python 3.8 or higher
- Node.js 14 or higher
- npm 7 or higher
- Docker and Docker Compose for containerized usage

## Architecture

The application follows a modern multi-tier architecture:

1. **Frontend**: React-based responsive web application with Material UI
2. **API Layer**: FastAPI RESTful API for processing requests and serving data
3. **Processing Layer**: Advanced ML models for audio processing and medical NLP

## Installation

### Docker Installation (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/chandru-b/patientvisit.git
   cd patientvisit
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the web application at http://localhost:3000

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/chandru-b/patientvisit.git
   cd patientvisit
   ```

2. Set up the backend:
   ```bash
   # Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   pip install -e .
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Run both services:
   ```bash
   # In terminal 1 (backend API)
   python -m api.main

   # In terminal 2 (frontend development server)
   cd frontend
   npm start
   ```

5. Access the development version:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# API Configuration
API_SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=sqlite:///./app.db

# Security Configuration
ENCRYPTION_KEY=your_encryption_key_here
```

### Configuration Files

- `config/default.json`: Default configuration values
- `config/production.json`: Production-specific overrides

## Usage

### Running in Development Mode

For active development with hot reloading:

```bash
# Install dependencies for both backend and frontend
npm run install:all

# Start both services in development mode
npm start
```

### Running in Production Mode

For production deployment:

```bash
# Build the frontend
npm run build:frontend

# Start the production server
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4

# Or with Gunicorn for production
gunicorn -k uvicorn.workers.UvicornWorker api.main:app --bind 0.0.0.0:8000 --workers 4
```

### Using Docker for Development

To run the application with separate frontend and backend containers:

```bash
docker-compose --profile dev up --build
```

Then access:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api

## Working with iOS and iPad

The web application is fully responsive and works on iPad and iOS devices:

1. Ensure your development machine and iOS device are on the same network
2. Run the application (either locally or in Docker)
3. On your iOS device, access your computer's IP address with the port:
   - http://your-ip-address:8000

For proper audio recording on iOS:
- iOS 14.3+ is recommended for Web Audio API support
- HTTPS is required for microphone access in production

## Security and HIPAA Compliance

- All patient data is encrypted using FERNET symmetric encryption
- Encryption keys are derived using PBKDF2 with strong password hashing
- Access controls and audit logging are implemented
- The Docker container provides isolation for enhanced security

## Development

### Project Structure

```
patientvisit/
├── backend/   
|   ├── api/                 # Backend FastAPI API
│        ├── __init__.py
│        ├── app.py           # API implementation
│        └── main.py          # Main API entry point
|   ├── utils/               # Shared utility modules
│        ├── audio_processing.py  # Audio processing utilities
│        ├── hipaa_compliance.py  # Security and compliance
│        └── summarization.py     # Text summarization
|   ├── docker/              # Docker configuration
|   ├── tests/               # Test suites
|   └── package.json         # Project scripts
├── frontend/            # React frontend
│   ├── public/          # Static assets
│   ├── src/             # React components and logic
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   ├── package.json     # Frontend dependencies
│   └── Dockerfile.dev   # Development Docker config
└── docker-compose.yml   # Container orchestration
```

### Running Tests

```bash
# Run backend tests
python -m unittest discover tests

# Run frontend tests
cd frontend && npm test

# Run end-to-end tests
npm run test:e2e
```

## Running with Visual Studio Code

1. Open the project folder in VS Code:
   ```bash
   code /path/to/patientvisit
   ```

2. Install recommended extensions:
   - Python
   - ES7 React/Redux/GraphQL/React-Native snippets
   - ESLint
   - Prettier

3. Use the integrated terminal to run the application:
   - Terminal 1: `uvicorn api.main:app --reload`
   - Terminal 2: `cd frontend && npm start`

4. Debug with VS Code:
   - Set breakpoints in the code
   - Use the provided launch configurations in .vscode/launch.json
   - Press F5 to start debugging

### Debugging with Dev Container

To debug the FastAPI application within a development container:

1. Open the project in VS Code with the Dev Containers extension installed
2. Click on the green button in the bottom-left corner and select "Reopen in Container"
3. Once the container is ready, open a terminal in VS Code and run:
   ```bash
   /workspace/.venv-debug/bin/python /workspace/debug_fastapi.py
   ```
4. The script will wait for the debugger to attach
5. Go to the Run and Debug panel in VS Code (Ctrl+Shift+D)
6. Select "Backend: FastAPI (Container)" from the dropdown
7. Press F5 to attach the debugger
8. Set breakpoints in your code and they will be hit when the code executes

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure the API service is running on port 8000
   - Check for CORS configuration issues in the API
   - Verify network connectivity between frontend and API

2. **Audio Recording Issues**
   - Grant microphone permissions in your browser
   - Use Chrome or Firefox for best audio recording support
   - On iOS, ensure you're using HTTPS (required for microphone access)

3. **Docker Deployment Issues**
   - Make sure Docker and Docker Compose are installed and running
   - Check if ports 3000 and 8000 are already in use
   - Review Docker logs: `docker-compose logs`

### Getting Help

Join our community support channels:
- GitHub Issues: https://github.com/chandru-b/patientvisit/issues
- Documentation: https://patientvisit.docs.example.com

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See the LICENSE file for details.

## Acknowledgments

- This project uses several open-source libraries and models
- Special thanks to the medical professionals who provided domain expertise
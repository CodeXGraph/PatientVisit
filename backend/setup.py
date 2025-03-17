from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name="patientvisit",
    version="0.1.0",
    packages=find_packages(),
    install_requires=requirements + [
        "uvicorn>=0.15.0",
        "fastapi>=0.68.0",
    ],
    entry_points={
        "console_scripts": [
            "patientvisit-api=api.server:run_server",  # New entry point for API server
        ],
    },
    author="Your Name",
    author_email="your.email@example.com",
    description="An application to create patient summaries from voice notes",
    keywords="healthcare, patient, summary, voice recognition",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Healthcare Industry",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
)
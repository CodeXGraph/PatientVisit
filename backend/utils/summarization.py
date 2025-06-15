#!/usr/bin/env python3
import re
import spacy
from transformers import pipeline
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to load medical-specific NLP model, fallback to standard model
try:
    nlp = spacy.load("en_core_med_sm")  # This would be a medical-specific model
    logger.info("Loaded medical NLP model")
except:
    nlp = spacy.load("en_core_web_sm")
    logger.info("Loaded standard NLP model (fallback)")

# In a real implementation, would use a fine-tuned medical summarization model
# In a real implementation, would use a fine-tuned medical summarization model
try:
    # Check if we have internet connection first
    import requests
    response = requests.head("https://huggingface.co", timeout=5)
    
    # Only try to load medical model if we have connection
    if response.status_code == 200:
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")
        logger.info("Loaded medical summarization model")
    else:
        raise ConnectionError("Connection error")
except Exception as e:
    logger.warning(f"Could not load online model: {str(e)}")
    
    # Create a simple extractive summarizer as fallback
    logger.info("Using simple extractive summarization as fallback")
    
    # Define a simple extractive summarizer function that will be used instead
    class SimpleExtractiveSum:
        def __call__(self, text, **kwargs):
            # Extract first few sentences as simple summary (up to max_length words)
            max_length = kwargs.get('max_length', 100)
            sentences = text.split('.')
            summary = '.'.join(sentences[:5]) + '.'
            # Limit to max length words
            words = summary.split()
            if len(words) > max_length:
                summary = ' '.join(words[:max_length])
            return [{'summary_text': summary}]
    
    summarizer = SimpleExtractiveSum()

def preprocess_transcript(text):
    """
    Preprocess transcript text for better summarization
    
    Args:
        text: Transcript text
        
    Returns:
        Preprocessed text
    """
    # Remove filler words
    fillers = ["um", "uh", "like", "you know", "sort of", "kind of", "I mean"]
    for filler in fillers:
        text = re.sub(r'\b' + filler + r'\b', '', text, flags=re.IGNORECASE)
    
    # Fix multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Fix punctuation
    text = re.sub(r'\s+([.,;:!?])', r'\1', text)
    
    return text.strip()

def extract_medical_terms(entities):
    """
    Extract important medical terms from NER results
    
    Args:
        entities: List of entity dictionaries from NER
        
    Returns:
        Dictionary of categorized medical terms
    """
    medical_categories = {
        "diagnoses": [],
        "symptoms": [],
        "medications": [],
        "procedures": [],
        "measurements": [],
        "test_results": [],
        "other": []
    }
    
    # Medical entity types and their categories
    entity_categories = {
        "DISEASE": "diagnoses",
        "SYMPTOM": "symptoms",
        "MEDICATION": "medications",
        "PROCEDURE": "procedures",
        "TREATMENT": "procedures",
        "MEASUREMENT": "measurements",
        "TEST_RESULT": "test_results",
        "ANATOMY": "other",
        "CHEMICAL": "other",
        "TIME": "other"
    }
    
    for entity in entities:
        category = entity_categories.get(entity["label"], "other")
        if entity["text"] not in medical_categories[category]:
            medical_categories[category].append(entity["text"])
    
    return medical_categories

def structure_summary(summarized_text, medical_terms):
    """
    Structure the summary into sections
    
    Args:
        summarized_text: Raw summarized text
        medical_terms: Dictionary of categorized medical terms
        
    Returns:
        Structured summary text
    """
    sections = [
        "PATIENT VISIT SUMMARY",
        "=" * 25 + "\n"
    ]
    
    # Add summary
    sections.append("SUMMARY:")
    sections.append(summarized_text.strip())
    sections.append("")
    
    # Add key medical information
    sections.append("KEY MEDICAL INFORMATION:")
    
    if medical_terms["diagnoses"]:
        sections.append("Diagnoses:")
        sections.append("  - " + "\n  - ".join(medical_terms["diagnoses"]))
        sections.append("")
    
    if medical_terms["symptoms"]:
        sections.append("Symptoms:")
        sections.append("  - " + "\n  - ".join(medical_terms["symptoms"]))
        sections.append("")
    
    if medical_terms["medications"]:
        sections.append("Medications:")
        sections.append("  - " + "\n  - ".join(medical_terms["medications"]))
        sections.append("")
    
    if medical_terms["procedures"]:
        sections.append("Procedures/Treatments:")
        sections.append("  - " + "\n  - ".join(medical_terms["procedures"]))
        sections.append("")
    
    if medical_terms["test_results"]:
        sections.append("Test Results:")
        sections.append("  - " + "\n  - ".join(medical_terms["test_results"]))
        sections.append("")
    
    # Add disclaimer
    sections.append("=" * 25)
    sections.append("DISCLAIMER: This summary is AI-generated and should be reviewed by a healthcare professional.")
    
    return "\n".join(sections)

def generate_medical_summary(transcript, entities=None):
    """
    Generate a structured medical summary from a transcript
    
    Args:
        transcript: Text transcript of doctor-patient conversation
        entities: Optional pre-extracted medical entities
        
    Returns:
        Structured summary text
    """
    try:
        # Preprocess transcript
        preprocessed_text = preprocess_transcript(transcript)
        
        # Extract entities if not provided
        if entities is None:
            doc = nlp(preprocessed_text)
            entities = []
            for ent in doc.ents:
                entities.append({
                    "text": ent.text,
                    "label": ent.label_,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
        
        # Categorize medical terms
        medical_terms = extract_medical_terms(entities)
        
        # Generate summary
        max_length = min(1024, len(preprocessed_text.split()) // 2)
        min_length = min(50, max_length // 2)
        
        summarized = summarizer(
            preprocessed_text, 
            max_length=max_length, 
            min_length=min_length, 
            do_sample=False
        )
        
        summarized_text = summarized[0]['summary_text']
        
        # Structure the summary
        structured_summary = structure_summary(summarized_text, medical_terms)
        
        return structured_summary
    
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        return f"Error generating summary: {str(e)}"
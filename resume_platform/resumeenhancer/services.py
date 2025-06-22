import os
import io
import asyncio
import google.generativeai as genai
from PyPDF2 import PdfReader

class GeminiResumeAnalysisService:
    """
    A service class to handle all interactions with the Google Gemini API
    for resume analysis.
    """

    def __init__(self):
        # Configure the Gemini API client from the environment variable.
        # This will be called once when the service is instantiated.
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)

    def _extract_text_from_pdf(self, pdf_file_content: bytes) -> str:
        """
        Extracts raw text content from the bytes of a PDF file.
        This is a synchronous, CPU-bound operation.
        """
        text = ""
        try:
            # Create a file-like object from the bytes content
            pdf_file = io.BytesIO(pdf_file_content)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            # Handle potential PyPDF2 errors
            print(f"Error extracting PDF text: {e}")
            return "" # Return empty string on failure
        return text

    def _get_analysis_prompt(self, resume_text: str) -> str:
        """
        Creates the detailed, structured prompt for the Gemini API.
        """
        # This is the "perfect prompt" you asked for. It tells the AI exactly
        # what to do, what format to use, and what persona to adopt.
        return f"""
        You are an expert career coach and professional resume reviewer for a company called ResumeAI.
        Your task is to analyze the following resume text and provide constructive, actionable feedback.

        The output must be a valid JSON object. Do not include any text or formatting before or after the JSON object.
        The JSON object must have the following keys: summary, strengths, improvements, score, and recommendations.

        - summary: A brief, one-sentence overview of the resumes quality.
        - strengths: A list of 3-4 specific positive aspects of the resume.
        - improvements: A list of 3-4 specific, actionable areas for improvement.
        - score: An estimated overall score for the resume out of 100.
        - recommendations: A list of next steps the user should take.

        Analyze this resume text:
        ---
        {resume_text}
        ---
        """


    async def analyze_resume(self, pdf_file_content: bytes) -> dict:
        """
        The main public method to perform the full resume analysis.
        It orchestrates text extraction and the async API call.
        """
        # Step 1: Extract text from the PDF. This is synchronous.
        loop = asyncio.get_running_loop()
        resume_text = await loop.run_in_executor(
            None, self._extract_text_from_pdf, pdf_file_content
        )

        if not resume_text:
            return {"error": "Could not extract text from the provided PDF."}

        # Step 2: Prepare the model and prompt
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = self._get_analysis_prompt(resume_text)

        # Step 3: Make the asynchronous API call to Gemini
        try:
            response = await model.generate_content_async(prompt)
            # The response from Gemini is often wrapped in markdown for JSON,
            # so we need to clean it before parsing.
            cleaned_json_string = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned_json_string)
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return {"error": "Failed to get analysis from AI service."}

import os
import asyncio
import google.generativeai as genai
import json

class GeminiTextEnhancementService:
    """
    A service class to handle all interactions with the Google Gemini API
    for enhancing resume text.
    """

    def __init__(self):
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)

    def _get_enhancement_prompt(self, text: str, context: str) -> str:
        """
        Creates the detailed, structured prompt for the Gemini API.
        This prompt guides the AI to act as a professional resume writer.
        """
        prompt = f"""
        You are an expert career coach and professional resume writer.
        Your task is to rewrite the following text block to make it more impactful and professional for a resume.

        **Instructions:**
        1.  Start sentences with strong, quantifiable action verbs.
        2.  Incorporate metrics and results where possible. If none are provided, suggest where they could be added.
        3.  Ensure the tone is professional and confident.
        4.  Correct any spelling or grammatical errors.
        5.  Do NOT add any introductory or concluding phrases like "Here is the enhanced version:".
        6.  Return ONLY the rewritten and enhanced text block. Nothing else.

        **Context for the text (if any):** "{context}"

        **Original Text to Enhance:**
        ---
        {text}
        ---
        """
        return prompt

    async def enhance_text(self, text_to_enhance: str, context: str = "") -> str:
        """
        The main public method to perform text enhancement.
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = self._get_enhancement_prompt(text_to_enhance, context)

        try:
            response = await model.generate_content_async(prompt)
            # We return the clean text directly from the response.
            return response.text.strip()
        except Exception as e:
            print(f"Error calling Gemini API for text enhancement: {e}")
            # Return original text if AI enhancement fails
            return text_to_enhance
import asyncio
from django.conf import settings # Import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from asgiref.sync import sync_to_async
import json

from .models import UploadedResume
from .services import GeminiResumeAnalysisService # <-- IMPORT THE NEW SERVICE

class ResumeUploadView(APIView):
    """Async view for handling resume file uploads."""

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    async def post(self, request):
        """Handle resume file upload asynchronously."""
        try:
            if 'file' not in request.FILES:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            uploaded_file = request.FILES['file']

            if not uploaded_file.name.lower().endswith('.pdf'):
                return Response({'error': 'Only PDF files are supported'}, status=status.HTTP_400_BAD_REQUEST)

            if uploaded_file.size > 10 * 1024 * 1024:
                return Response({'error': 'File size must be less than 10MB'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the DB entry first. It now saves the file directly to S3
            # because of our settings.py configuration.
            uploaded_resume = await self._create_uploaded_resume(request.user, uploaded_file)

            # Start AI analysis in the background
            asyncio.create_task(self._run_ai_analysis(uploaded_resume.id))

            return Response({
                'upload_id': uploaded_resume.id,
                'status': 'pending',
                'message': 'File uploaded successfully. AI analysis started.'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # In production, you would log this error.
            print(f"Upload failed: {e}")
            return Response({'error': 'An unexpected error occurred during upload.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @sync_to_async
    def _create_uploaded_resume(self, user, file):
        """Create UploadedResume object synchronously."""
        # This function is now simpler because sync_to_async is a decorator
        return UploadedResume.objects.create(
            user=user,
            original_file=file,
            status='pending'
        )

    async def _run_ai_analysis(self, upload_id):
        """Run AI analysis on uploaded resume asynchronously."""
        get_resume = sync_to_async(UploadedResume.objects.get)
        save_resume = sync_to_async(lambda r: r.save()) # Use a lambda for saving

        try:
            uploaded_resume = await get_resume(id=upload_id)
            uploaded_resume.status = 'processing'
            await save_resume(uploaded_resume)

            # Read the file content directly from S3 storage
            file_content = uploaded_resume.original_file.read()

            # --- USE THE NEW SERVICE ---
            # Instantiate our service and call the analysis method
            analysis_service = GeminiResumeAnalysisService()
            analysis_results = await analysis_service.analyze_resume(file_content)

            # Update with results
            uploaded_resume.analysis_results = analysis_results
            uploaded_resume.status = 'complete' if 'error' not in analysis_results else 'failed'
            await save_resume(uploaded_resume)

        except Exception as e:
            print(f"Analysis failed for upload_id {upload_id}: {e}")
            try:
                # Try to fetch the object again to update its status to failed
                failed_resume = await get_resume(id=upload_id)
                failed_resume.status = 'failed'
                failed_resume.analysis_results = {'error': str(e)}
                await save_resume(failed_resume)
            except:
                pass # If we can't save the error, log it in a real app

class ResumeStatusView(APIView):
    """View to check the status of uploaded resume analysis."""

    permission_classes = [IsAuthenticated]

    async def get(self, request, upload_id):
        """Get the current status of resume analysis asynchronously."""
        try:
            get_resume = sync_to_async(UploadedResume.objects.get)
            uploaded_resume = await get_resume(id=upload_id, user=request.user)

            response_data = {
                'upload_id': uploaded_resume.id,
                'status': uploaded_resume.status,
            }

            if uploaded_resume.status == 'complete' and uploaded_resume.analysis_results:
                response_data['analysis_results'] = uploaded_resume.analysis_results

            return Response(response_data, status=status.HTTP_200_OK)

        except UploadedResume.DoesNotExist:
            return Response({'error': 'Upload not found'}, status=status.HTTP_404_NOT_FOUND)
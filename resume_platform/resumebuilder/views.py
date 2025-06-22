import asyncio
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import transaction

from .models import Resume
from .serializers import ResumeSerializer, TextEnhancementSerializer
from .permissions import IsPremiumUser
from .services import GeminiTextEnhancementService


class ResumeViewSet(viewsets.ModelViewSet):
    """ViewSet for CRUD operations on Resume model with nested serialization."""
    
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return resumes for the current user only."""
        return Resume.objects.filter(user=self.request.user).prefetch_related(
            'contact_info',
            'work_experiences',
            'education_entries',
            'skills'
        )
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only premium users can create/modify resumes
            permission_classes = [IsAuthenticated, IsPremiumUser]
        else:
            # All authenticated users can view resumes
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a new resume with nested data."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # The serializer's create method handles nested object creation
        resume = serializer.save()
        
        # Return the created resume with all nested data
        response_serializer = self.get_serializer(resume)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update resume with nested data."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # The serializer's update method handles nested object updates
        resume = serializer.save()
        
        # Return the updated resume with all nested data
        response_serializer = self.get_serializer(resume)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['get'])
    def export(self, request, pk=None):
        """Export resume data in a structured format."""
        resume = self.get_object()
        serializer = self.get_serializer(resume)
        
        # Add export metadata
        export_data = {
            'export_date': timezone.now().isoformat(),
            'user': request.user.username,
            'resume_data': serializer.data
        }
        
        return Response(export_data)


class TextEnhancementView(APIView):
    """Async view for AI text enhancement."""
    
    permission_classes = [IsAuthenticated, IsPremiumUser]
    
    async def post(self, request):
        """Enhance text using AI asynchronously."""
        try:
            serializer = TextEnhancementSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            validated_data = serializer.validated_data
            text_to_enhance = validated_data['text']
            context = validated_data.get('context', '') # Get context if provided
            
            # --- USE THE NEW SERVICE ---
            # Instantiate our service and call the enhancement method
            enhancement_service = GeminiTextEnhancementService()
            enhanced_text = await enhancement_service.enhance_text(text_to_enhance, context)
            
            return Response({
                'original_text': text_to_enhance,
                'enhanced_text': enhanced_text
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # In production, you would log this error.
            print(f"Text enhancement view failed: {e}")
            return Response(
                {'error': 'An unexpected error occurred during text enhancement.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResumeAnalyticsView(APIView):
    """View for resume analytics and insights."""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get analytics for user's resumes."""
        user_resumes = Resume.objects.filter(user=request.user)
        
        analytics = {
            'total_resumes': user_resumes.count(),
            'total_work_experiences': sum(
                resume.work_experiences.count() for resume in user_resumes
            ),
            'total_education_entries': sum(
                resume.education_entries.count() for resume in user_resumes
            ),
            'total_skills': sum(
                resume.skills.count() for resume in user_resumes
            ),
            'most_recent_resume': None
        }
        
        # Get most recent resume
        if user_resumes.exists():
            most_recent = user_resumes.first()
            analytics['most_recent_resume'] = {
                'id': most_recent.id,
                'title': most_recent.title,
                'updated_at': most_recent.updated_at
            }
        
        return Response(analytics)

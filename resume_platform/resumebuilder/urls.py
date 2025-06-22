from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, TextEnhancementView, ResumeAnalyticsView

app_name = 'resumebuilder'

# Create router for ViewSet
router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Additional API endpoints
    path('enhance-text/', TextEnhancementView.as_view(), name='enhance-text'),
    path('analytics/', ResumeAnalyticsView.as_view(), name='analytics'),
]
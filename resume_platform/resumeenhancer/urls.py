from django.urls import path
from .views import ResumeUploadView, ResumeStatusView

app_name = 'resumeenhancer'

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('status/<int:upload_id>/', ResumeStatusView.as_view(), name='resume-status'),
]
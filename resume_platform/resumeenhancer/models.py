from django.db import models
from django.conf import settings


class UploadedResume(models.Model):
    """Model to track uploaded resumes for AI enhancement."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('complete', 'Complete'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_resumes'
    )
    
    original_file = models.FileField(
        upload_to='uploaded_resumes/%Y/%m/%d/',
        help_text="Original resume file uploaded by user"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current processing status"
    )
    
    analysis_results = models.JSONField(
        blank=True,
        null=True,
        help_text="AI analysis results stored as JSON"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Uploaded Resume'
        verbose_name_plural = 'Uploaded Resumes'
    
    def __str__(self):
        return f"{self.user.username} - {self.original_file.name} ({self.status})"
    
    @property
    def is_processing_complete(self):
        """Check if processing is complete (success or failure)."""
        return self.status in ['complete', 'failed']

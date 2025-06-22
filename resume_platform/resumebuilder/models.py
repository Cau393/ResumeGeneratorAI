from django.db import models
from django.conf import settings


class Resume(models.Model):
    """Main resume model that serves as parent for all resume sections."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    
    title = models.CharField(
        max_length=200,
        help_text="Title or name for this resume"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ContactInfo(models.Model):
    """Contact information for a resume."""
    
    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name='contact_info'
    )
    
    full_name = models.CharField(
        max_length=200,
        help_text="Full name of the resume owner"
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Phone number"
    )
    
    email = models.EmailField(
        help_text="Email address"
    )
    
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="City, State or full address"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.resume.title}"


class WorkExperience(models.Model):
    """Work experience entries for a resume."""
    
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='work_experiences'
    )
    
    company = models.CharField(
        max_length=200,
        help_text="Company name"
    )
    
    role = models.CharField(
        max_length=200,
        help_text="Job title or role"
    )
    
    start_date = models.DateField(
        help_text="Start date of employment"
    )
    
    end_date = models.DateField(
        blank=True,
        null=True,
        help_text="End date of employment (leave blank if current)"
    )
    
    description = models.TextField(
        help_text="Job description and achievements"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Work Experience'
        verbose_name_plural = 'Work Experiences'
    
    def __str__(self):
        return f"{self.role} at {self.company}"
    
    @property
    def is_current(self):
        """Check if this is a current position."""
        return self.end_date is None


class Education(models.Model):
    """Education entries for a resume."""
    
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='education_entries'
    )
    
    institution = models.CharField(
        max_length=200,
        help_text="School or university name"
    )
    
    degree = models.CharField(
        max_length=200,
        help_text="Degree type and field of study"
    )
    
    graduation_date = models.DateField(
        help_text="Graduation date"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-graduation_date']
        verbose_name = 'Education'
        verbose_name_plural = 'Education Entries'
    
    def __str__(self):
        return f"{self.degree} from {self.institution}"


class Skill(models.Model):
    """Skills for a resume."""
    
    SKILL_CATEGORIES = [
        ('technical', 'Technical'),
        ('soft', 'Soft'),
        ('language', 'Language'),
        ('other', 'Other'),
    ]
    
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    
    name = models.CharField(
        max_length=100,
        help_text="Skill name"
    )
    
    category = models.CharField(
        max_length=20,
        choices=SKILL_CATEGORIES,
        default='technical',
        help_text="Skill category"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        unique_together = ['resume', 'name']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

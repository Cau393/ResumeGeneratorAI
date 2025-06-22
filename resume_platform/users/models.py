from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Custom user model with additional fields for subscription management."""
    
    SUBSCRIPTION_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
        ('expired', 'Expired'),
    ]
    
    stripe_customer_id = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Stripe customer ID for payment processing"
    )
    
    subscription_status = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_CHOICES,
        default='free',
        help_text="Current subscription status"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.subscription_status})"
    
    @property
    def is_premium(self):
        """Check if user has premium subscription."""
        return self.subscription_status == 'premium'
    
    @property
    def can_use_builder(self):
        """Check if user can access the resume builder."""
        return self.subscription_status == 'premium'

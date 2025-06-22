from rest_framework import permissions


class IsPremiumUser(permissions.BasePermission):
    """Permission class to check if user has premium subscription."""
    
    message = "Premium subscription required to access this feature."
    
    def has_permission(self, request, view):
        """Check if user has premium subscription."""
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has premium subscription
        return request.user.subscription_status == 'premium'
    
    def has_object_permission(self, request, view, obj):
        """Check object-level permissions for premium users."""
        # First check if user has premium subscription
        if not self.has_permission(request, view):
            return False
        
        # For resume-related objects, ensure user owns the resume
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'resume'):
            return obj.resume.user == request.user
        
        return True


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Permission class to allow owners to edit their own objects."""
    
    def has_object_permission(self, request, view, obj):
        """Check if user owns the object or is making a read-only request."""
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'resume'):
            return obj.resume.user == request.user
        
        return False


class IsPremiumOrReadOnly(permissions.BasePermission):
    """Permission class that allows read access to all authenticated users but write access only to premium users."""
    
    def has_permission(self, request, view):
        """Check permissions at view level."""
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow write operations only for premium users
        return request.user.subscription_status == 'premium'
    
    def has_object_permission(self, request, view, obj):
        """Check object-level permissions."""
        # Read permissions for any authenticated user who owns the object
        if request.method in permissions.SAFE_METHODS:
            if hasattr(obj, 'user'):
                return obj.user == request.user
            elif hasattr(obj, 'resume'):
                return obj.resume.user == request.user
            return True
        
        # Write permissions only for premium users who own the object
        if request.user.subscription_status != 'premium':
            return False
        
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'resume'):
            return obj.resume.user == request.user
        
        return False
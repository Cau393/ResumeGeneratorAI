from rest_framework import serializers
from .models import Resume, ContactInfo, WorkExperience, Education, Skill


class ContactInfoSerializer(serializers.ModelSerializer):
    """Serializer for ContactInfo model."""
    
    class Meta:
        model = ContactInfo
        fields = ['id', 'full_name', 'phone', 'email', 'location']


class WorkExperienceSerializer(serializers.ModelSerializer):
    """Serializer for WorkExperience model."""
    
    is_current = serializers.ReadOnlyField()
    
    class Meta:
        model = WorkExperience
        fields = [
            'id', 'company', 'role', 'start_date', 'end_date', 
            'description', 'is_current', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EducationSerializer(serializers.ModelSerializer):
    """Serializer for Education model."""
    
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'graduation_date', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for Skill model."""
    
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'category', 'category_display', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ResumeSerializer(serializers.ModelSerializer):
    """Nested serializer for Resume model with all related data."""
    
    contact_info = ContactInfoSerializer(required=False)
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    education_entries = EducationSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'contact_info', 'work_experiences', 
            'education_entries', 'skills', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create resume with nested related objects."""
        contact_info_data = validated_data.pop('contact_info', None)
        work_experiences_data = validated_data.pop('work_experiences', [])
        education_entries_data = validated_data.pop('education_entries', [])
        skills_data = validated_data.pop('skills', [])
        
        # Set user from request context
        validated_data['user'] = self.context['request'].user
        
        # Create resume
        resume = Resume.objects.create(**validated_data)
        
        # Create contact info if provided
        if contact_info_data:
            ContactInfo.objects.create(resume=resume, **contact_info_data)
        
        # Create work experiences
        for work_exp_data in work_experiences_data:
            WorkExperience.objects.create(resume=resume, **work_exp_data)
        
        # Create education entries
        for edu_data in education_entries_data:
            Education.objects.create(resume=resume, **edu_data)
        
        # Create skills
        for skill_data in skills_data:
            Skill.objects.create(resume=resume, **skill_data)
        
        return resume
    
    def update(self, instance, validated_data):
        """Update resume with nested related objects."""
        contact_info_data = validated_data.pop('contact_info', None)
        work_experiences_data = validated_data.pop('work_experiences', [])
        education_entries_data = validated_data.pop('education_entries', [])
        skills_data = validated_data.pop('skills', [])
        
        # Update resume fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create contact info
        if contact_info_data:
            contact_info, created = ContactInfo.objects.get_or_create(
                resume=instance,
                defaults=contact_info_data
            )
            if not created:
                for attr, value in contact_info_data.items():
                    setattr(contact_info, attr, value)
                contact_info.save()
        
        # Handle work experiences (replace all)
        if work_experiences_data:
            instance.work_experiences.all().delete()
            for work_exp_data in work_experiences_data:
                WorkExperience.objects.create(resume=instance, **work_exp_data)
        
        # Handle education entries (replace all)
        if education_entries_data:
            instance.education_entries.all().delete()
            for edu_data in education_entries_data:
                Education.objects.create(resume=instance, **edu_data)
        
        # Handle skills (replace all)
        if skills_data:
            instance.skills.all().delete()
            for skill_data in skills_data:
                Skill.objects.create(resume=instance, **skill_data)
        
        return instance


class TextEnhancementSerializer(serializers.Serializer):
    """Serializer for text enhancement requests."""
    
    text = serializers.CharField(
        max_length=5000,
        help_text="Text to be enhanced by AI"
    )
    context = serializers.CharField(
        required=False, 
        allow_blank=True,
        help_text="Optional context, e.g., 'Work experience for a senior python developer role.'"
    )
    
    def validate_text(self, value):
        """Validate that text is not empty."""
        if not value.strip():
            raise serializers.ValidationError("Text cannot be empty.")
        return value.strip()
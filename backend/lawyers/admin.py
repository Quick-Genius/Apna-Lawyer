from django.contrib import admin
from .models import Lawyer

@admin.register(Lawyer)
class LawyerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'license_number', 'primary_practice_area', 'years_of_experience', 'created_at']
    list_filter = ['primary_practice_area', 'practice_location', 'years_of_experience', 'created_at']
    search_fields = ['name', 'email', 'license_number', 'primary_practice_area']
    readonly_fields = ['id', 'created_at']




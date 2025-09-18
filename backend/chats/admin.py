from django.contrib import admin
from .models import UserChat

@admin.register(UserChat)
class UserChatAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__name', 'user__email', 'user_text_input']
    readonly_fields = ['id', 'created_at']
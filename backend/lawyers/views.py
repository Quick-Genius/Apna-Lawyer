from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Lawyer, Specialization
from django.contrib.auth import get_user_model

@login_required
def lawyer_registration(request):
    if request.method == 'POST':
        # Handle lawyer registration form submission
        pass
    return render(request, 'lawyer_registration.html')

def lawyer_list(request):
    lawyers = Lawyer.objects.filter(available=True)
    return render(request, 'lawyers/lawyer_list.html', {'lawyers': lawyers})

def lawyer_profile(request, lawyer_id):
    lawyer = get_object_or_404(Lawyer, id=lawyer_id)
    return render(request, 'lawyers/lawyer_profile.html', {'lawyer': lawyer})
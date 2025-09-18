from django.db import models

class LawyerRegistration(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    license_number = models.CharField(max_length=100)
    professional_info = models.TextField()
    years_of_experience = models.PositiveIntegerField()
    primary_practice_area = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    certification_document = models.FileField(upload_to='certifications/')```

#### **`lawyers/views.py`**

```python
from django.shortcuts import render, redirect
from .forms import LawyerRegistrationForm

def register_lawyer(request):
    if request.method == 'POST':
        form = LawyerRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = LawyerRegistrationForm()
    return render(request, 'lawyer_registration.html', {'form': form})
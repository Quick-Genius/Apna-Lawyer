from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Lawyer
import uuid

User = get_user_model()

class LawyerAPITestCase(APITestCase):
    def setUp(self):
        self.lawyer_list_url = reverse('lawyer-list')
        self.lawyer_create_url = reverse('lawyer-create')
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            name='Test User',
            password='testpass123'
        )
        
        # Create test lawyers
        self.lawyer1 = Lawyer.objects.create(
            name='John Doe',
            email='john.doe@lawfirm.com',
            phone_number='+1234567890',
            license_number='LAW123456',
            professional_information='Experienced criminal lawyer',
            years_of_experience=10,
            primary_practice_area='Criminal Law',
            practice_location='New York',
            working_court='Supreme Court'
        )
        
        self.lawyer2 = Lawyer.objects.create(
            name='Jane Smith',
            email='jane.smith@lawfirm.com',
            phone_number='+1234567891',
            license_number='LAW123457',
            professional_information='Corporate law specialist',
            years_of_experience=8,
            primary_practice_area='Corporate Law',
            practice_location='California',
            working_court='District Court'
        )
        
        self.valid_lawyer_data = {
            'name': 'Bob Johnson',
            'email': 'bob.johnson@lawfirm.com',
            'phone_number': '+1234567892',
            'license_number': 'LAW123458',
            'professional_information': 'Family law expert',
            'years_of_experience': 12,
            'primary_practice_area': 'Family Law',
            'practice_location': 'Texas',
            'working_court': 'Family Court'
        }

    def test_lawyer_list_get(self):
        """Test getting list of lawyers"""
        response = self.client.get(self.lawyer_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Check if lawyer data is properly serialized
        lawyer_names = [lawyer['name'] for lawyer in response.data]
        self.assertIn('John Doe', lawyer_names)
        self.assertIn('Jane Smith', lawyer_names)

    def test_lawyer_create_valid_data(self):
        """Test creating a lawyer with valid data"""
        response = self.client.post(self.lawyer_create_url, self.valid_lawyer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.valid_lawyer_data['name'])
        self.assertEqual(response.data['email'], self.valid_lawyer_data['email'])
        
        # Verify lawyer was created in database
        self.assertTrue(Lawyer.objects.filter(email=self.valid_lawyer_data['email']).exists())

    def test_lawyer_create_duplicate_email(self):
        """Test creating a lawyer with duplicate email"""
        duplicate_data = self.valid_lawyer_data.copy()
        duplicate_data['email'] = self.lawyer1.email
        
        response = self.client.post(self.lawyer_create_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_lawyer_create_duplicate_license(self):
        """Test creating a lawyer with duplicate license number"""
        duplicate_data = self.valid_lawyer_data.copy()
        duplicate_data['license_number'] = self.lawyer1.license_number
        
        response = self.client.post(self.lawyer_create_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_lawyer_create_missing_required_fields(self):
        """Test creating a lawyer with missing required fields"""
        incomplete_data = {
            'name': 'Incomplete Lawyer',
            'email': 'incomplete@lawfirm.com'
            # Missing phone_number and license_number
        }
        
        response = self.client.post(self.lawyer_create_url, incomplete_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_lawyer_viewset_list(self):
        """Test LawyerViewSet list action"""
        url = reverse('lawyer-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_lawyer_viewset_retrieve(self):
        """Test LawyerViewSet retrieve action"""
        url = reverse('lawyer-detail', kwargs={'pk': self.lawyer1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.lawyer1.name)
        self.assertEqual(response.data['email'], self.lawyer1.email)

    def test_lawyer_viewset_create(self):
        """Test LawyerViewSet create action"""
        url = '/lawyers/lawyers/'  # Direct URL since reverse('lawyer-list') conflicts
        response = self.client.post(url, self.valid_lawyer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.valid_lawyer_data['name'])

    def test_lawyer_viewset_update(self):
        """Test LawyerViewSet update action"""
        url = reverse('lawyer-detail', kwargs={'pk': self.lawyer1.pk})
        update_data = {
            'name': 'John Doe Updated',
            'email': self.lawyer1.email,
            'phone_number': self.lawyer1.phone_number,
            'license_number': self.lawyer1.license_number,
            'years_of_experience': 15
        }
        
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'John Doe Updated')
        self.assertEqual(response.data['years_of_experience'], 15)

    def test_lawyer_viewset_partial_update(self):
        """Test LawyerViewSet partial update action"""
        url = reverse('lawyer-detail', kwargs={'pk': self.lawyer1.pk})
        update_data = {
            'years_of_experience': 12
        }
        
        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['years_of_experience'], 12)
        self.assertEqual(response.data['name'], self.lawyer1.name)  # Should remain unchanged

    def test_lawyer_viewset_delete(self):
        """Test LawyerViewSet delete action"""
        url = reverse('lawyer-detail', kwargs={'pk': self.lawyer1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify lawyer was deleted
        self.assertFalse(Lawyer.objects.filter(pk=self.lawyer1.pk).exists())

    def test_lawyer_viewset_not_found(self):
        """Test LawyerViewSet with non-existent lawyer"""
        fake_id = uuid.uuid4()
        url = reverse('lawyer-detail', kwargs={'pk': fake_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
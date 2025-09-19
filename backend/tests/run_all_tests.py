#!/usr/bin/env python
"""
Master test runner for all backend tests
"""

import os
import sys
import subprocess
from pathlib import Path

# Add backend to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def run_endpoint_tests():
    """Run API endpoint tests"""
    print("🚀 Running API Endpoint Tests...")
    print("=" * 50)
    
    try:
        result = subprocess.run([
            sys.executable, 
            str(backend_dir / "tests" / "test_endpoints.py")
        ], capture_output=True, text=True, cwd=backend_dir)
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running endpoint tests: {e}")
        return False

def run_supabase_tests():
    """Run Supabase connection tests"""
    print("\n🔗 Running Supabase Connection Tests...")
    print("=" * 50)
    
    try:
        result = subprocess.run([
            sys.executable, 
            str(backend_dir / "tests" / "test_supabase_connection.py")
        ], capture_output=True, text=True, cwd=backend_dir)
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running Supabase tests: {e}")
        return False

def run_django_tests():
    """Run Django unit tests"""
    print("\n🧪 Running Django Unit Tests...")
    print("=" * 50)
    
    try:
        result = subprocess.run([
            sys.executable, "manage.py", "test"
        ], capture_output=True, text=True, cwd=backend_dir)
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running Django tests: {e}")
        return False

def main():
    print("🧪 APNA LAWYER - COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    
    # Check if server is running
    import requests
    try:
        response = requests.get('http://localhost:8000/', timeout=5)
        print("✅ Django server is running")
    except:
        print("⚠️  Django server not detected. Some tests may fail.")
        print("   Start server with: python manage.py runserver")
    
    print("\n" + "=" * 60)
    
    # Run all test suites
    results = []
    
    # 1. Django unit tests
    results.append(("Django Unit Tests", run_django_tests()))
    
    # 2. API endpoint tests
    results.append(("API Endpoint Tests", run_endpoint_tests()))
    
    # 3. Supabase tests
    results.append(("Supabase Tests", run_supabase_tests()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} test suites passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  Some tests failed. Check output above.")
        return 1

if __name__ == '__main__':
    exit(main())
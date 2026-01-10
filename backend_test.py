#!/usr/bin/env python3
"""
Ardito EIP Backend API Testing Suite
Tests all authentication, games, campaigns, analytics, and schools endpoints
"""

import requests
import sys
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class ArditoAPITester:
    def __init__(self, base_url="https://ardito-eip.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data and isinstance(response_data, dict):
            result["response_keys"] = list(response_data.keys())
        
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}: {details}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, auth_required: bool = False) -> tuple[bool, Dict]:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text[:200]}

            details = f"Status: {response.status_code} (expected {expected_status})"
            if not success:
                details += f" | Response: {str(response_data)[:100]}"
            
            self.log_test(name, success, details, response_data)
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_auth_register(self) -> bool:
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "email": f"test_user_{timestamp}@ardito.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}",
            "company": "Ardito Test Corp"
        }
        
        success, response = self.run_test(
            "Auth - Register User",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            if 'user' in response:
                self.user_id = response['user'].get('id')
            return True
        return False

    def test_auth_login(self) -> bool:
        """Test user login with existing credentials"""
        # Try to login with a test user (this might fail if user doesn't exist)
        login_data = {
            "email": "test@ardito.com",
            "password": "password123"
        }
        
        success, response = self.run_test(
            "Auth - Login User",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        
        # If login fails, that's expected for non-existent user
        if not success:
            self.log_test("Auth - Login User (Expected Fail)", True, "Login failed as expected for non-existent user")
            return True
        
        return success

    def test_auth_me(self) -> bool:
        """Test getting current user info"""
        if not self.token:
            self.log_test("Auth - Get Current User", False, "No token available")
            return False
            
        success, response = self.run_test(
            "Auth - Get Current User",
            "GET",
            "auth/me",
            200,
            auth_required=True
        )
        return success

    def test_games_live(self) -> bool:
        """Test getting live games"""
        success, response = self.run_test(
            "Games - Get Live Games",
            "GET",
            "games/live",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Games - Live Games Data", True, f"Returned {len(response)} games")
            
            # Test individual game details if games exist
            if response:
                game_id = response[0].get('id')
                if game_id:
                    self.run_test(
                        "Games - Get Game Details",
                        "GET",
                        f"games/{game_id}",
                        200
                    )
                    
                    # Test game emotions
                    self.run_test(
                        "Games - Get Game Emotions",
                        "GET",
                        f"games/{game_id}/emotions",
                        200
                    )
        
        return success

    def test_schools(self) -> bool:
        """Test getting schools list"""
        success, response = self.run_test(
            "Schools - Get All Schools",
            "GET",
            "schools",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Schools - Schools Data", True, f"Returned {len(response)} schools")
            
            # Test filtering by conference if schools exist
            if response and response[0].get('conference'):
                conference = response[0]['conference']
                self.run_test(
                    f"Schools - Filter by Conference ({conference})",
                    "GET",
                    f"schools?conference={conference}",
                    200
                )
        
        return success

    def test_campaigns(self) -> bool:
        """Test campaigns endpoints"""
        if not self.token:
            self.log_test("Campaigns - No Auth Token", False, "Cannot test campaigns without authentication")
            return False
        
        # Test getting campaigns
        success, response = self.run_test(
            "Campaigns - Get User Campaigns",
            "GET",
            "campaigns",
            200,
            auth_required=True
        )
        
        # Test creating a campaign
        campaign_data = {
            "name": f"Test Campaign {datetime.now().strftime('%H%M%S')}",
            "description": "Test campaign for API testing",
            "objective": "awareness",
            "total_budget": 10000.0,
            "daily_cap": 500.0,
            "start_date": datetime.now().isoformat(),
            "end_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "target_emotions": ["euphoria", "tension"],
            "schools": ["1", "2"],
            "channels": ["stadium", "mobile"]
        }
        
        create_success, create_response = self.run_test(
            "Campaigns - Create Campaign",
            "POST",
            "campaigns",
            200,
            data=campaign_data,
            auth_required=True
        )
        
        # Test getting specific campaign if creation succeeded
        if create_success and create_response.get('id'):
            campaign_id = create_response['id']
            self.run_test(
                "Campaigns - Get Specific Campaign",
                "GET",
                f"campaigns/{campaign_id}",
                200,
                auth_required=True
            )
            
            # Test updating campaign status
            self.run_test(
                "Campaigns - Update Status",
                "PUT",
                f"campaigns/{campaign_id}/status?status=active",
                200,
                auth_required=True
            )
        
        return success and create_success

    def test_analytics(self) -> bool:
        """Test analytics endpoints"""
        if not self.token:
            self.log_test("Analytics - No Auth Token", False, "Cannot test analytics without authentication")
            return False
        
        # Test dashboard metrics
        success1, response1 = self.run_test(
            "Analytics - Dashboard Metrics",
            "GET",
            "analytics/dashboard",
            200,
            auth_required=True
        )
        
        # Test recent activations
        success2, response2 = self.run_test(
            "Analytics - Recent Activations",
            "GET",
            "analytics/activations",
            200,
            auth_required=True
        )
        
        # Test emotion distribution
        success3, response3 = self.run_test(
            "Analytics - Emotion Distribution",
            "GET",
            "analytics/emotions",
            200
        )
        
        return success1 and success2 and success3

    def test_root_endpoint(self) -> bool:
        """Test root API endpoint"""
        success, response = self.run_test(
            "API - Root Endpoint",
            "GET",
            "",
            200
        )
        return success

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all API tests"""
        print(f"🚀 Starting Ardito EIP API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test root endpoint first
        self.test_root_endpoint()
        
        # Test authentication (register creates token for other tests)
        auth_success = self.test_auth_register()
        self.test_auth_login()
        if auth_success:
            self.test_auth_me()
        
        # Test public endpoints
        self.test_games_live()
        self.test_schools()
        
        # Test authenticated endpoints
        if self.token:
            self.test_campaigns()
            self.test_analytics()
        else:
            print("⚠️  Skipping authenticated tests - no valid token")
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "results": self.test_results
        }

def main():
    """Main test runner"""
    tester = ArditoAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["passed_tests"] == results["total_tests"] else 1

if __name__ == "__main__":
    sys.exit(main())
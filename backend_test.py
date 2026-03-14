import requests
import sys
from datetime import datetime
import time
import json

class SellerRadarAPITester:
    def __init__(self, base_url="https://seller-radar-pro.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session_id = None

    def log(self, message, level="info"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        prefix = {"info": "ℹ️", "success": "✅", "error": "❌", "warning": "⚠️"}.get(level, "ℹ️")
        print(f"[{timestamp}] {prefix} {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'} if data else {}

        self.tests_run += 1
        self.log(f"Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"{name} - Status: {response.status_code}", "success")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, response.content
            else:
                self.log(f"{name} - Expected {expected_status}, got {response.status_code}", "error")
                self.log(f"Response: {response.text[:200]}", "error")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            self.log(f"{name} - Error: {str(e)}", "error")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root", "GET", "/", 200
        )
        if success:
            assert "SellerRadar Pro API" in str(response.get("message", ""))
            self.log("Root endpoint returns correct message", "success")
        return success

    def test_seed_data(self):
        """Test seeding demo data"""
        success, response = self.run_test(
            "Seed Demo Data", "POST", "/seed", 200
        )
        if success:
            self.log(f"Seeded {response.get('sellers_count', 0)} sellers", "success")
        return success

    def test_stats(self):
        """Test stats endpoint"""
        success, response = self.run_test(
            "Get Stats", "GET", "/stats", 200
        )
        if success:
            required_fields = ["total_sellers", "confirmed_sellers", "products_scanned", "duplicates_skipped", "is_running"]
            for field in required_fields:
                if field not in response:
                    self.log(f"Missing field in stats: {field}", "error")
                    return False
            self.log(f"Stats: {response['total_sellers']} sellers, {response['products_scanned']} products scanned", "success")
        return success

    def test_sellers_list(self):
        """Test sellers list endpoint"""
        success, response = self.run_test(
            "Get Sellers List", "GET", "/sellers", 200
        )
        if success:
            assert "sellers" in response
            assert "total" in response
            assert "page" in response
            self.log(f"Retrieved {len(response['sellers'])} sellers", "success")
        return success

    def test_sellers_search(self):
        """Test sellers search functionality"""
        success, response = self.run_test(
            "Search Sellers", "GET", "/sellers", 200,
            params={"search": "Tech"}
        )
        if success:
            self.log(f"Search returned {len(response['sellers'])} results", "success")
        return success

    def test_sellers_marketplace_filter(self):
        """Test sellers marketplace filter"""
        success, response = self.run_test(
            "Filter by Marketplace", "GET", "/sellers", 200,
            params={"marketplace": "amazon.de"}
        )
        if success:
            self.log(f"Marketplace filter returned {len(response['sellers'])} results", "success")
        return success

    def test_sellers_phone_filter(self):
        """Test sellers with phone filter"""
        success, response = self.run_test(
            "Filter Has Phone", "GET", "/sellers", 200,
            params={"has_phone": True}
        )
        if success:
            self.log(f"Phone filter returned {len(response['sellers'])} results", "success")
        return success

    def test_sellers_vat_filter(self):
        """Test sellers with VAT filter"""
        success, response = self.run_test(
            "Filter Has VAT", "GET", "/sellers", 200,
            params={"has_vat": True}
        )
        if success:
            self.log(f"VAT filter returned {len(response['sellers'])} results", "success")
        return success

    def test_delete_seller(self):
        """Test deleting a seller"""
        # First get a seller to delete
        success, sellers_response = self.run_test(
            "Get Seller for Deletion", "GET", "/sellers", 200,
            params={"limit": 1}
        )
        if success and sellers_response.get("sellers"):
            seller_id = sellers_response["sellers"][0]["id"]
            success, response = self.run_test(
                "Delete Seller", "DELETE", f"/sellers/{seller_id}", 200
            )
            if success:
                self.log("Seller deleted successfully", "success")
            return success
        else:
            self.log("No sellers found to delete", "warning")
            return True

    def test_activity_log(self):
        """Test activity log endpoint"""
        success, response = self.run_test(
            "Get Activity Log", "GET", "/activity-log", 200
        )
        if success:
            assert "entries" in response
            self.log(f"Retrieved {len(response['entries'])} log entries", "success")
        return success

    def test_worker_start(self):
        """Test starting the mock worker"""
        worker_config = {
            "marketplace": "amazon.de",
            "mode": "continuous",
            "target_count": 0,
            "min_delay": 2,
            "max_delay": 4,
            "manual_review": False
        }
        success, response = self.run_test(
            "Start Worker", "POST", "/worker/start", 200, data=worker_config
        )
        if success:
            self.session_id = response.get("session_id")
            self.log(f"Worker started with session_id: {self.session_id}", "success")
        return success

    def test_worker_status(self):
        """Test worker status endpoint"""
        success, response = self.run_test(
            "Get Worker Status", "GET", "/worker/status", 200
        )
        if success:
            assert "is_running" in response
            self.log(f"Worker running: {response['is_running']}", "success")
        return success

    def test_worker_stop(self):
        """Test stopping the worker"""
        success, response = self.run_test(
            "Stop Worker", "POST", "/worker/stop", 200
        )
        if success:
            self.log("Worker stopped successfully", "success")
        return success

    def test_latest_session(self):
        """Test getting latest session"""
        success, response = self.run_test(
            "Get Latest Session", "GET", "/sessions/latest", 200
        )
        if success:
            self.log("Latest session retrieved", "success")
        return success

    def test_settings(self):
        """Test settings endpoints"""
        # Get settings
        success, response = self.run_test(
            "Get Settings", "GET", "/settings", 200
        )
        if not success:
            return False

        # Update settings
        update_data = {"manual_review_enabled": True}
        success, response = self.run_test(
            "Update Settings", "PUT", "/settings", 200, data=update_data
        )
        if success:
            assert response.get("manual_review_enabled") == True
            self.log("Settings updated successfully", "success")
        return success

    def test_review_endpoints(self):
        """Test manual review endpoints"""
        success, response = self.run_test(
            "Get Pending Reviews", "GET", "/review/pending", 200
        )
        if success:
            self.log(f"Retrieved {len(response)} pending reviews", "success")
            
            # If there are pending reviews, test confirm/skip
            if response:
                review_id = response[0]["id"]
                
                # Test confirm
                success, _ = self.run_test(
                    "Confirm Review", "POST", f"/review/{review_id}/confirm", 200
                )
                if not success:
                    return False
                    
                self.log("Review confirmed successfully", "success")
        return success

    def test_export_excel(self):
        """Test Excel export"""
        success, response = self.run_test(
            "Export Excel", "GET", "/export/excel", 200
        )
        if success:
            self.log("Excel export successful", "success")
        return success

    def test_export_csv(self):
        """Test CSV export"""
        success, response = self.run_test(
            "Export CSV", "GET", "/export/csv", 200
        )
        if success:
            self.log("CSV export successful", "success")
        return success

    def test_clear_data(self):
        """Test clearing all data"""
        success, response = self.run_test(
            "Clear All Data", "POST", "/data/clear", 200
        )
        if success:
            self.log("Data cleared successfully", "success")
        return success

def main():
    """Main test execution"""
    print("="*60)
    print("🧪 SellerRadar Pro API Testing Suite")
    print("="*60)
    
    tester = SellerRadarAPITester()
    
    # Test sequence
    tests = [
        ("API Root", tester.test_root_endpoint),
        ("Seed Demo Data", tester.test_seed_data),
        ("Get Stats", tester.test_stats),
        ("Get Sellers", tester.test_sellers_list),
        ("Search Sellers", tester.test_sellers_search),
        ("Filter by Marketplace", tester.test_sellers_marketplace_filter),
        ("Filter by Phone", tester.test_sellers_phone_filter),
        ("Filter by VAT", tester.test_sellers_vat_filter),
        ("Delete Seller", tester.test_delete_seller),
        ("Activity Log", tester.test_activity_log),
        ("Start Worker", tester.test_worker_start),
        ("Worker Status", tester.test_worker_status),
        ("Stop Worker", tester.test_worker_stop),
        ("Latest Session", tester.test_latest_session),
        ("Settings", tester.test_settings),
        ("Review Endpoints", tester.test_review_endpoints),
        ("Export Excel", tester.test_export_excel),
        ("Export CSV", tester.test_export_csv),
        ("Clear Data", tester.test_clear_data),
    ]
    
    failed_count = 0
    for test_name, test_func in tests:
        try:
            result = test_func()
            if not result:
                failed_count += 1
        except Exception as e:
            tester.log(f"Test {test_name} failed with exception: {e}", "error")
            failed_count += 1
        
        # Small delay between tests
        time.sleep(0.5)
    
    # Print summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print(f"✅ Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"❌ Tests failed: {tester.tests_run - tester.tests_passed}")
    
    if tester.failed_tests:
        print("\n🚫 Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  • {failure.get('test', 'Unknown')}")
            if 'error' in failure:
                print(f"    Error: {failure['error']}")
            else:
                print(f"    Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
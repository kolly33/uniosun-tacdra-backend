#!/bin/bash
# Deployment Test Script for UNIOSUN TACDRA API
# Run this after your Render deployment is complete

# Configuration
API_BASE_URL="https://uniosun-tacdra-backend.onrender.com"
TIMEOUT=30

echo "🧪 Testing UNIOSUN TACDRA API Deployment"
echo "========================================"
echo "API Base URL: $API_BASE_URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo "Testing: $description"
    echo "URL: ${API_BASE_URL}${endpoint}"
    
    response=$(curl -s -w "%{http_code}" -m $TIMEOUT "${API_BASE_URL}${endpoint}" || echo "000")
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo "✅ PASS - HTTP $http_code"
        if [ ! -z "$body" ] && [ "$body" != "null" ]; then
            echo "📄 Response: ${body:0:100}..."
        fi
    else
        echo "❌ FAIL - Expected HTTP $expected_status, got HTTP $http_code"
        if [ "$http_code" = "000" ]; then
            echo "   Error: Connection timeout or failed"
        fi
    fi
    echo ""
}

# Test Health Endpoints
echo "🔍 Health Check Tests"
echo "--------------------"
test_endpoint "/" "200" "Root Health Check"
test_endpoint "/health" "200" "Detailed Health Check"

# Test API Documentation
echo "📚 Documentation Tests"
echo "----------------------"
test_endpoint "/api/docs" "200" "Swagger Documentation"

# Test Authentication Endpoints (should return 400/422 for missing data)
echo "🔐 Authentication Tests"
echo "-----------------------"
test_endpoint "/api/auth/student/login" "400" "Student Login (no data)"
test_endpoint "/api/auth/staff/login" "400" "Staff Login (no data)"

# Test Protected Endpoints (should return 401 for no auth)
echo "🔒 Protected Endpoint Tests"
echo "---------------------------"
test_endpoint "/api/applications" "401" "Applications (no auth)"
test_endpoint "/api/users/profile" "401" "User Profile (no auth)"

# Test File Upload Endpoint
echo "📁 File Upload Tests"
echo "--------------------"
test_endpoint "/api/upload/document" "401" "Document Upload (no auth)"

# Test Payment Endpoints
echo "💳 Payment Tests"
echo "----------------"
test_endpoint "/api/payment" "401" "Payment List (no auth)"

# Test API with Valid Registration Data
echo "📝 Registration Test"
echo "--------------------"
echo "Testing student registration with sample data..."

registration_data='{
  "matriculationNumber": "CSC/2020/100",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.100@student.uniosun.edu.ng",
  "password": "Password123!",
  "phoneNumber": "+2348123456789",
  "graduationYear": 2024
}'

reg_response=$(curl -s -w "%{http_code}" -m $TIMEOUT \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$registration_data" \
  "${API_BASE_URL}/api/auth/student/register" || echo "000")

reg_http_code="${reg_response: -3}"
reg_body="${reg_response%???}"

if [ "$reg_http_code" = "201" ] || [ "$reg_http_code" = "409" ]; then
    echo "✅ PASS - Registration endpoint working (HTTP $reg_http_code)"
    if [ "$reg_http_code" = "409" ]; then
        echo "   Note: User already exists (expected in production)"
    fi
else
    echo "❌ FAIL - Registration issue (HTTP $reg_http_code)"
    echo "   Response: ${reg_body:0:200}..."
fi
echo ""

# Summary
echo "📊 Deployment Test Summary"
echo "=========================="
echo "✅ If all health checks pass, your API is successfully deployed!"
echo "📚 Access your API documentation at: ${API_BASE_URL}/api/docs"
echo "🔗 Share this API URL with your frontend team"
echo ""
echo "🔄 Next Steps:"
echo "1. Update frontend to use: $API_BASE_URL"
echo "2. Test complete user workflows"
echo "3. Configure production payment credentials"
echo "4. Set up monitoring and alerts"
echo ""
echo "🎉 Congratulations! Your UNIOSUN TACDRA API is live!"

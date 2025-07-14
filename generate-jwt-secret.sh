#!/bin/bash
# JWT Secret Generator for UNIOSUN TACDRA

echo "🔐 JWT Secret Generator for UNIOSUN TACDRA"
echo "=========================================="
echo ""

# Generate a secure JWT secret
jwt_secret=$(openssl rand -base64 48 2>/dev/null || node -e "console.log(require('crypto').randomBytes(48).toString('base64'))" 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(48))" 2>/dev/null || echo "Please install openssl, node, or python3 to generate secure secret")

echo "Generated JWT Secret (copy this for Render environment variables):"
echo "======================================================================"
echo ""
echo "JWT_SECRET=$jwt_secret"
echo ""
echo "======================================================================"
echo ""
echo "📋 Instructions:"
echo "1. Copy the JWT_SECRET value above"
echo "2. In Render Dashboard → Environment Variables"
echo "3. Add: Key='JWT_SECRET', Value='$jwt_secret'"
echo "4. Keep this secret secure and never commit it to git!"
echo ""
echo "🔒 Security Notes:"
echo "- This secret is used to sign and verify JWT tokens"
echo "- Length: $(echo -n "$jwt_secret" | wc -c) characters (recommended: 32+)"
echo "- Contains: Letters, numbers, and special characters"
echo "- Generated using cryptographically secure methods"
echo ""

# External Payment API Documentation

## Overview

This API allows external systems to create payment entries in the centralized payment management system. The API uses API key authentication for secure access.

**Base URL**: `http://your-server-domain/api/external`

---

## Authentication

All requests to the external payment API must include a valid API key in the request headers.

### API Key Header

You can provide the API key in one of two ways:

1. **Using `x-api-key` header** (Recommended):
   ```
   x-api-key: your-api-key-here
   ```

2. **Using `Authorization` header**:
   ```
   Authorization: Bearer your-api-key-here
   ```

### Getting Your API Key

Contact the system administrator to obtain your API key. The API key is configured in the server environment variables.

---

## Endpoints

### Create Payment Entry

Create a new payment entry in the system.

**Endpoint**: `POST /api/external/create`

**Headers**:
```
Content-Type: application/json
x-api-key: your-api-key-here
```

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number (decimal) | Yes | Base payment amount (must be >= 0) |
| `month` | string | Yes | Payment month (e.g., "January", "2024-01") |
| `userId` | integer | Yes | User ID associated with the payment (must be >= 1) |
| `tenant` | string | No | Tenant identifier for multi-tenant systems |
| `year` | integer | No | Payment year (2000-2100) |
| `meta` | object (JSON) | No | Additional metadata as JSON object |
| `note` | string | No | Additional notes or comments |
| `extra_amount` | number (decimal) | No | Extra charges or fees (default: 0, must be >= 0) |
| `total_amount` | number (decimal) | No | Total payment amount. If not provided, calculated as `amount + extra_amount` |

**Example Request**:

```json
{
  "amount": 5000.00,
  "month": "January",
  "userId": 123,
  "tenant": "school-abc",
  "year": 2024,
  "meta": {
    "payment_method": "bank_transfer",
    "transaction_id": "TXN123456",
    "reference": "REF789"
  },
  "note": "Monthly tuition fee payment",
  "extra_amount": 200.00,
  "total_amount": 5200.00
}
```

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "amount": 5000.00,
    "month": "January",
    "userId": 123,
    "tenant": "school-abc",
    "year": 2024,
    "meta": {
      "payment_method": "bank_transfer",
      "transaction_id": "TXN123456",
      "reference": "REF789"
    },
    "note": "Monthly tuition fee payment",
    "extra_amount": 200.00,
    "total_amount": 5200.00,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

1. **401 Unauthorized** - Missing or invalid API key:
```json
{
  "success": false,
  "message": "API key is required. Please provide it in the 'x-api-key' header or 'Authorization' header as 'Bearer <key>'"
}
```

2. **400 Bad Request** - Validation error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Amount is required and must be a number",
      "param": "amount",
      "location": "body"
    }
  ]
}
```

3. **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

---

## Code Examples

### cURL

```bash
curl -X POST http://your-server-domain/api/external/create \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{
    "amount": 5000.00,
    "month": "January",
    "userId": 123,
    "tenant": "school-abc",
    "year": 2024,
    "note": "Monthly tuition fee payment",
    "extra_amount": 200.00
  }'
```

### JavaScript (Fetch API)

```javascript
const createPayment = async () => {
  const response = await fetch('http://your-server-domain/api/external/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key-here'
    },
    body: JSON.stringify({
      amount: 5000.00,
      month: 'January',
      userId: 123,
      tenant: 'school-abc',
      year: 2024,
      note: 'Monthly tuition fee payment',
      extra_amount: 200.00
    })
  });

  const data = await response.json();
  console.log(data);
};
```

### Python (requests)

```python
import requests

url = 'http://your-server-domain/api/external/create'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here'
}
payload = {
    'amount': 5000.00,
    'month': 'January',
    'userId': 123,
    'tenant': 'school-abc',
    'year': 2024,
    'note': 'Monthly tuition fee payment',
    'extra_amount': 200.00
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

### PHP

```php
<?php
$url = 'http://your-server-domain/api/external/create';
$data = [
    'amount' => 5000.00,
    'month' => 'January',
    'userId' => 123,
    'tenant' => 'school-abc',
    'year' => 2024,
    'note' => 'Monthly tuition fee payment',
    'extra_amount' => 200.00
];

$options = [
    'http' => [
        'header' => [
            'Content-Type: application/json',
            'x-api-key: your-api-key-here'
        ],
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>
```

---

## Field Descriptions

### Required Fields

- **amount**: The base payment amount. Must be a positive decimal number.
- **month**: The month for which the payment is being made. Can be in any format (e.g., "January", "2024-01", "Jan 2024").
- **userId**: The unique identifier of the user making the payment. Must be a positive integer.

### Optional Fields

- **tenant**: Useful for multi-tenant systems to identify which organization/school the payment belongs to.
- **year**: The year of the payment. Must be between 2000 and 2100.
- **meta**: A JSON object for storing additional structured data like transaction IDs, payment methods, references, etc.
- **note**: Free-form text field for additional comments or notes about the payment.
- **extra_amount**: Additional charges, fees, or adjustments. Defaults to 0 if not provided.
- **total_amount**: The total payment amount. If not provided, it will be automatically calculated as `amount + extra_amount`.

---

## Best Practices

1. **Always include the API key**: Ensure your API key is included in every request header.

2. **Validate data before sending**: Validate all required fields and data types before making the API call.

3. **Handle errors gracefully**: Implement proper error handling for all possible response codes.

4. **Use HTTPS in production**: Always use HTTPS when making API calls in production environments.

5. **Store API key securely**: Never hardcode API keys in client-side code. Store them securely in environment variables or secure configuration files.

6. **Implement retry logic**: For production systems, implement retry logic for transient failures.

7. **Monitor API usage**: Keep track of API calls and monitor for any unusual activity.

---

## Rate Limiting

Currently, there are no rate limits implemented. However, please use the API responsibly. If you need to make bulk requests, consider batching them or contacting the administrator for special arrangements.

---

## Support

For issues, questions, or to obtain an API key, please contact the system administrator.

---

## Changelog

### Version 1.0.0 (Initial Release)
- Initial external payment API
- API key authentication
- Payment creation with extended fields (tenant, year, meta, note, extra_amount, total_amount)


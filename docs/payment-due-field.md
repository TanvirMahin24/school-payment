# Payment Due Field Integration Guide

The payment API now supports an optional `due` boolean field. This field is only a marker for whether a payment entry is a due entry. It does not change any calculation for `amount`, `extra_amount`, `exam_fee`, or `total_amount`.

## API Field

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `due` | boolean | No | `false` | Marks the payment entry as due when `true`. |

If `due` is omitted, the payment system stores it as `false`.

## Single External Payment

Endpoint:

```http
POST /api/external/create
```

Example payload:

```json
{
  "amount": 1200,
  "month": "January",
  "userId": 101,
  "tenant": "primary",
  "year": 2026,
  "extra_amount": 0,
  "exam_fee": 300,
  "total_amount": 1500,
  "note": "January fee",
  "due": true
}
```

Example response data includes:

```json
{
  "id": 1,
  "amount": "1200.00",
  "month": "January",
  "userId": 101,
  "tenant": "primary",
  "year": 2026,
  "extra_amount": "0.00",
  "exam_fee": "300.00",
  "total_amount": "1500.00",
  "due": true
}
```

## Bulk External Payments

Endpoint:

```http
POST /api/external/create-bulk
```

Example payload:

```json
{
  "payments": [
    {
      "amount": 1200,
      "month": "January",
      "userId": 101,
      "tenant": "primary",
      "year": 2026,
      "extra_amount": 0,
      "exam_fee": 300,
      "due": true
    },
    {
      "amount": 1000,
      "month": "January",
      "userId": 102,
      "tenant": "primary",
      "year": 2026,
      "extra_amount": 0,
      "exam_fee": 0,
      "due": false
    }
  ]
}
```

Each payment item can omit `due`; omitted values are stored as `false`.

## External UI Guidance

Add an off-by-default switch or checkbox labeled `Due` wherever users create or edit a payment. Submit the checked state as:

```json
{
  "due": true
}
```

When the switch is off, submit `false` or omit the field. Existing amount and total calculations should stay exactly the same.

## Due Payment List

Tenant websites for `coaching`, `primary`, and `school` can fetch students with due payments for a selected month.

Authentication:

```http
x-api-key: <EXTERNAL_API_KEY>
```

or:

```http
Authorization: Bearer <EXTERNAL_API_KEY>
```

Endpoint:

```http
GET /api/external/due-payments?tenant=school&year=2026&month=May&gradeId=1&shiftId=2&batchId=3
```

Required query params: `tenant`, `year`, `month`.

Optional query params: `gradeId`, `shiftId`, `batchId`.

Success format:

```json
{
  "success": true,
  "message": "Due payment list",
  "data": [
    {
      "id": 12,
      "amount": "1200.00",
      "month": "May",
      "userId": 101,
      "tenant": "school",
      "year": 2026,
      "extra_amount": "0.00",
      "exam_fee": "300.00",
      "total_amount": "1500.00",
      "due": true,
      "gradePrimaryId": 1,
      "shiftPrimaryId": 2,
      "batchPrimaryId": 3,
      "student": {
        "id": 101,
        "uid": 15,
        "name": "Student Name",
        "phone": "01700000000"
      }
    }
  ]
}
```

## Clear Due Status

Use this endpoint after a confirmation step in the tenant website UI.

Endpoint:

```http
PATCH /api/external/payments/12/due
```

Payload:

```json
{
  "due": false
}
```

Success format:

```json
{
  "success": true,
  "message": "Due payment updated successfully",
  "data": {
    "id": 12,
    "due": false,
    "tenant": "school",
    "year": 2026,
    "month": "May",
    "userId": 101
  }
}
```

Error format:

```json
{
  "success": false,
  "message": "Payment not found"
}
```

Validation error format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Year should be a valid year",
      "param": "year",
      "location": "query"
    }
  ]
}
```

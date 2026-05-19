# Payment Due Amount Field Integration Guide

The payment API now supports an optional `due_amount` field. This field stores the amount owed when a payment is marked as due (`due: true`). It does not affect any calculation for `amount`, `extra_amount`, `exam_fee`, or `total_amount`.

## API Field

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `due_amount` | number (DECIMAL 10,2) | No | `null` | The amount owed for a due payment. Only meaningful when `due` is `true`. |

If `due_amount` is omitted, it is stored as `null`.

## Single External Payment

Endpoint:

```http
POST /api/external/create
```

Example payload with due amount:

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
  "due": true,
  "due_amount": 1500
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
  "due": true,
  "due_amount": "1500.00"
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
      "due": true,
      "due_amount": 1500
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

Each payment item can omit `due_amount`; omitted values are stored as `null`.

## Frontend Integration

### Payment Entry Page

- Each student row has a **Due Amount** input field next to the Due switch.
- The Due Amount input is **disabled** by default.
- When the **Due** switch is toggled ON, the Due Amount input becomes **enabled** and accepts a numeric value.
- When the Due switch is OFF, the submitted `due_amount` is `null`.
- There is **no bulk fill** support for the Due Amount field.

### Payment Edit Form

- The Due Amount field follows the same pattern: **disabled** unless the Due switch is ON.
- When editing an existing due payment, the Due Amount value pre-fills from the database.
- If the Due switch is turned OFF during edit, the Due Amount is cleared to `null` on save.

### Submission Logic

When submitting a payment:

```js
due_amount: payment.due && payment.due_amount ? parseFloat(payment.due_amount) : null
```

- If `due` is `true` and `due_amount` has a value, send the parsed number.
- Otherwise, send `null`.

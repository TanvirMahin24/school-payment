# External Due Amount Integration Guide

This guide is for external tenant services that integrate with the school payment system through `/api/external/*`.

The current payment changeset adds support for `due_amount` and also changes the clear-due flow so that clearing a due payment resets `due_amount` to `0`.

## What Changed

External services should now support two related fields:

| Field | Type | Required | Default | Meaning |
| --- | --- | --- | --- | --- |
| `due` | boolean | No | `false` | Marks the payment as due. |
| `due_amount` | number | No | `null` on create/update, `0` when due is cleared | The amount still owed for that payment. |

Key behavior:

- If `due` is `true`, external UIs should allow users to enter `due_amount`.
- If `due` is `false` during normal create/update submission, `due_amount` may be sent as `null` or omitted.
- If the dedicated clear-due API is used, the backend now saves:
  - `due = false`
  - `due_amount = 0`

## Authentication

External endpoints accept either of these headers:

```http
x-api-key: <EXTERNAL_API_KEY>
```

or:

```http
Authorization: Bearer <EXTERNAL_API_KEY>
```

## Create Single Payment

Endpoint:

```http
POST /api/external/create
```

Example request:

```json
{
  "amount": 1200,
  "month": "May",
  "userId": 101,
  "tenant": "school",
  "year": 2026,
  "extra_amount": 0,
  "exam_fee": 300,
  "total_amount": 1500,
  "due": true,
  "due_amount": 500
}
```

Example success response:

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
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
    "due_amount": "500.00",
    "createdAt": "2026-05-18T00:00:00.000Z",
    "updatedAt": "2026-05-18T00:00:00.000Z"
  }
}
```

## Create Bulk Payments

Endpoint:

```http
POST /api/external/create-bulk
```

Example request:

```json
{
  "payments": [
    {
      "amount": 1200,
      "month": "May",
      "userId": 101,
      "tenant": "school",
      "year": 2026,
      "due": true,
      "due_amount": 500
    },
    {
      "amount": 1200,
      "month": "May",
      "userId": 102,
      "tenant": "school",
      "year": 2026,
      "due": false
    }
  ]
}
```

Integration notes:

- Each payment item may include `due_amount`.
- If `due_amount` is omitted, it is stored as `null`.
- `due_amount` must be numeric when sent.

## Due Payment List Response

Endpoint:

```http
GET /api/external/due-payments?tenant=school&year=2026&month=May
```

Optional filters:

- `gradeId`
- `shiftId`
- `batchId`

Example success response:

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
      "due_amount": "500.00",
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

Response change to note:

- External services should read and display `due_amount` from due-payment list items.
- This field is intended to be the displayed outstanding amount for each due payment row.

## Clear Due Status

Endpoint:

```http
PATCH /api/external/payments/:id/due
```

Example request:

```json
{
  "due": false
}
```

Updated success response:

```json
{
  "success": true,
  "message": "Due payment updated successfully",
  "data": {
    "id": 12,
    "due": false,
    "due_amount": "0.00",
    "tenant": "school",
    "year": 2026,
    "month": "May",
    "userId": 101
  }
}
```

Important response change:

- After clearing due status, the API now returns `due_amount` as zero.
- External services should immediately update the local row/state using the response payload instead of assuming only the `due` flag changed.

## UI Guidelines For External Services

External tenant apps should mirror the UI behavior already used in this project.

### Payment Create Form

- Show a `Due` switch or checkbox.
- Show a `Due Amount` numeric input beside or below the `Due` control.
- Keep `Due Amount` disabled until `Due` is turned on.
- When `Due` is turned on, enable `Due Amount` and allow numeric entry.
- When `Due` is turned off before submit, clear the field in the UI and submit `null` or omit `due_amount`.

Recommended submission logic:

```js
due_amount: payment.due && payment.due_amount
  ? parseFloat(payment.due_amount)
  : null
```

### Payment Edit Form

- Pre-fill `Due` from the payment response.
- Pre-fill `Due Amount` from `payment.due_amount`.
- Keep the field disabled when `due` is `false`.
- If the user turns `Due` off in the edit screen, clear the input in the UI before submit.

### Due Payments Page

- Show the `due_amount` value in the due-payments list.
- Use `due_amount` for any total due calculation shown on the page.
- Add a confirmation step before calling the clear-due API.
- After a successful clear-due response:
  - update the item to `due: false`
  - update `due_amount` to `0`
  - remove the item from a due-only filtered list, or refresh the list from the server

## Validation Notes

- `due_amount` must be a number greater than or equal to `0` when provided.
- `due` must be a boolean.
- External apps should avoid sending non-numeric strings for `due_amount`.

## Recommended Frontend Handling

- Treat `due_amount` as nullable when reading normal payment data.
- Treat `0` as a meaningful value after due-clear operations.
- When rendering, handle both string and number forms because decimal values may be returned as strings from the API.

Example display handling:

```js
const dueAmount = payment?.due_amount ? parseFloat(payment.due_amount) : 0;
```

If you need to preserve an empty input state in forms, keep the form field as a string in component state and only convert it to a number during submission.

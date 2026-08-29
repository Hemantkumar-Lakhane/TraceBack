# TraceBack - Global API Error Standard

To ensure frontend-backend consistency, all error responses from the Spring Boot API will adhere to the following strict JSON format, returned with appropriate HTTP status codes (400, 401, 403, 404, 500).

```json
{
  "timestamp": "2026-08-29T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for the submitted report",
  "path": "/api/reports/lost",
  "details": [
    {
      "field": "date_lost",
      "issue": "Must not be in the future"
    },
    {
      "field": "location",
      "issue": "Location is required"
    }
  ]
}
```

### Breakdown of Fields:
* `timestamp`: ISO-8601 timestamp of when the error occurred.
* `status`: HTTP status code (integer).
* `error`: Standard HTTP error string (e.g., "Bad Request", "Not Found").
* `message`: Human-readable summary of the error. Safe to display to the user in a toast notification.
* `path`: The URI that was requested.
* `details`: (Optional) Array of specific validation errors. Especially used for `400 Bad Request` during form submissions to highlight individual fields.

### HTTP Status Code Mapping:
* `400 Bad Request`: Form validation failure, invalid enum, bad constraints.
* `401 Unauthorized`: Missing, expired, or invalid JWT token.
* `403 Forbidden`: Valid token, but user role is insufficient (e.g., Student trying to access Security endpoints).
* `404 Not Found`: Entity (Report, Item, Match) does not exist or user doesn't own it.
* `409 Conflict`: Attempting to create a duplicate claim or match record.
* `500 Internal Server Error`: Unhandled backend exception.

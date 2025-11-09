# Pathly Backend API Documentation


## API Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Pathly Backend API is running!",
  "status": "healthy"
}
```

---

## Gemini AI Routes

Base path: `/api/gemini`

### Generate Roadmap

Generate or retrieve a learning roadmap based on a user question.

**Endpoint:** `POST /api/gemini/generate-map`

**Request Body:**
```json
{
  "question": "I want to learn web development"
}
```

**Response (Both New and Existing Skills):**
```json
{
  "success": true,
  "skill": "Machine Learning",
  "roadmap": [
    {
      "MajorNode": "Foundations of Machine Learning",
      "Topics": [
        {
          "SubNode": "Introduction to Machine Learning",
          "Description": "Understand the core concepts, types of ML (supervised, unsupervised, reinforcement learning), and common applications.",
          "Resources": [
            "Machine Learning Crash Course by Google",
            "Introduction to Machine Learning by Coursera (Andrew Ng)",
            "Wikipedia: Machine Learning"
          ]
        },
        {
          "SubNode": "Linear Algebra Essentials",
          "Description": "Grasp the fundamental concepts of vectors, matrices, and their operations.",
          "Resources": [
            "Khan Academy: Linear Algebra",
            "3Blue1Brown: Essence of linear algebra (YouTube series)"
          ]
        }
      ]
    },
    {
      "MajorNode": "Core Machine Learning Algorithms",
      "Topics": [
        {
          "SubNode": "Supervised Learning: Regression",
          "Description": "Learn algorithms like Linear Regression and Polynomial Regression.",
          "Resources": [
            "Scikit-learn documentation on Linear Models",
            "StatQuest with Josh Starmer: Linear Regression (YouTube)"
          ]
        }
      ]
    }
  ]
}
```

> **Note:** The response format is identical whether the skill is newly generated or retrieved from the database.

**Status Codes:**
- `200` - Success
- `400` - Missing question
- `500` - Server error

---

## Skills Routes

Base path: `/api/skills`

### Get All Skills

Retrieve all skills stored in the database.

**Endpoint:** `GET /api/skills`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "question": "I want to learn web development",
      "skill": "Web Development",
      "createdAt": "2025-11-09T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "question": "How to become a data scientist?",
      "skill": "Data Science",
      "createdAt": "2025-11-08T14:20:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Roadmap by Skill ID

Retrieve the roadmap for a specific skill using its ID.

**Endpoint:** `GET /api/skills/roadmap/:skillId`

**Parameters:**
- `skillId` (path parameter) - MongoDB ObjectId

**Example Request:**
```bash
GET /api/skills/roadmap/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "skill": "Machine Learning",
  "roadmap": [
    {
      "MajorNode": "Foundations of Machine Learning",
      "Topics": [
        {
          "SubNode": "Introduction to Machine Learning",
          "Description": "Understand the core concepts, types of ML.",
          "Resources": [
            "Machine Learning Crash Course by Google",
            "Introduction to Machine Learning by Coursera"
          ]
        },
        {
          "SubNode": "Python for Data Science",
          "Description": "Become proficient in Python and its essential libraries.",
          "Resources": [
            "Python for Everybody (Coursera)",
            "Python Data Science Handbook by Jake VanderPlas"
          ]
        }
      ]
    },
    {
      "MajorNode": "Core Machine Learning Algorithms",
      "Topics": [
        {
          "SubNode": "Supervised Learning: Regression",
          "Description": "Learn algorithms like Linear Regression.",
          "Resources": [
            "Scikit-learn documentation on Linear Models"
          ]
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing skill ID
- `404` - Roadmap not found
- `500` - Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Testing Examples


### Using JavaScript/Fetch

```javascript
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Generate roadmap
const response = await fetch(`${BACKEND_URL}/api/gemini/generate-map`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'I want to learn Python'
  })
});
const data = await response.json();

// Get all skills
const skills = await fetch(`${BACKEND_URL}/api/skills`)
  .then(res => res.json());

// Get roadmap by skill ID
const roadmap = await fetch(`${BACKEND_URL}/api/skills/roadmap/507f1f77bcf86cd799439011`)
  .then(res => res.json());
```

---

## Rate Limiting

The API implements two-tier rate limiting to protect against abuse and ensure fair usage:

### General API Rate Limit
- **Applies to:** All `/api/*` endpoints (including skills routes)
- **Limit:** 100 requests per 15 minutes per IP address

### AI Generation Rate Limit
- **Applies to:** `POST /api/gemini/generate-map`
- **Limit:** 10 requests per hour per IP address

### Rate Limit Response

When rate limit is exceeded, you'll receive:

```json
{
  "success": false,
  "error": {
    "message": "Too many requests from this IP, please try again later."
  },
  "timestamp": "2025-11-09T10:30:00.000Z"
}
```

**Status Code:** `429 Too Many Requests`

---

## Notes

- All endpoints return JSON responses
- The server uses CORS, so cross-origin requests are allowed
- Skill IDs must be valid MongoDB ObjectIds (24 character hex string)
- Skills are returned in reverse chronological order (newest first)
- The Gemini AI endpoint automatically detects if a skill already exists and returns the cached roadmap
- Response format is consistent for both new and existing skills
- Roadmap structure includes `MajorNode` (main learning phases) and `Topics` (specific subtopics with descriptions and resources)
- Rate limiting is enforced per IP address to prevent API abuse

---

## Setup & Running

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with required environment variables:
```bash
# Copy the example file
cp .env.example .env

# Then edit .env with your actual values
```

Required environment variables:
```
PORT=3000
BACKEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```


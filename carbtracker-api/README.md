# CarbTracker API

FastAPI backend for the CarbTracker mobile app - AI-powered carbohydrate estimation for Type 1 diabetics.

## Setup

### Prerequisites
- Python 3.11+
- Docker (for PostgreSQL)
- Anthropic API key

### Installation

1. Create and activate a virtual environment:
```bash
cd carbtracker-api
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment file and add your API key:
```bash
copy .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

4. Start PostgreSQL with Docker:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Main Endpoints

### POST /api/v1/analyze
Analyze a meal photo for carbohydrate estimation.

**Request:** multipart/form-data
- `image` (file): Meal photo (JPEG, PNG, WebP)
- `description` (string, optional): Text description of the meal

**Response:**
```json
{
  "analysis_id": "uuid",
  "foods": [{
    "id": "string",
    "most_likely": {"name": "string", "confidence": 90, "carbs": 30},
    "alternatives": [{"name": "string", "confidence": 10, "carbs": 45}],
    "portion": "1 medium"
  }],
  "quick_tap_questions": [{
    "id": "string",
    "question": "What size?",
    "options": [{"label": "Small", "carb_adjustment": -10}]
  }],
  "preliminary_estimate": {"min": 25, "max": 45, "likely": 35}
}
```

### POST /api/v1/analyze/{analysis_id}/finalize
Finalize estimate after user confirmations.

### POST /api/v1/meals/log
Log a meal with final carb count.

### GET /api/v1/meals
Get meal history.

## Deployment

### Railway
1. Connect your GitHub repo
2. Add PostgreSQL service
3. Set environment variables:
   - ANTHROPIC_API_KEY
   - DATABASE_URL (auto-set by Railway)
   - R2 credentials (optional)

## Project Structure

```
carbtracker-api/
├── app/
│   ├── main.py           # FastAPI app entry
│   ├── config.py         # Settings management
│   ├── database.py       # Database connection
│   ├── routers/
│   │   ├── analysis.py   # Meal analysis endpoints
│   │   └── meals.py      # Meal history endpoints
│   ├── services/
│   │   ├── claude_vision.py    # Claude Vision API
│   │   ├── quick_tap_engine.py # Question generation
│   │   └── r2_storage.py       # Image storage
│   ├── models/
│   │   └── meal.py       # SQLAlchemy models
│   └── schemas/
│       └── analysis.py   # Pydantic schemas
├── alembic/              # Database migrations
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

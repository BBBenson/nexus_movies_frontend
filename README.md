

### Frontend Setup (Next.js)

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

The Next.js app will be available at `http://143.110.152.152/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Movies
- `GET /api/movies/` - Get movies by category (popular, top_rated, upcoming)
- `GET /api/movies/search/` - Search movies
- `GET /api/movies/{id}/` - Get movie details

### Favorites
- `GET /api/favorites/` - Get user favorites
- `POST /api/favorites/` - Add movie to favorites
- `DELETE /api/favorites/{movie_id}/` - Remove movie from favorites

## Features

- User authentication with JWT tokens
- Movie browsing by categories (Popular, Top Rated, Upcoming)
- Movie search functionality
- User favorites management
- Responsive design with dark/light mode
- Real-time movie data from TMDb API

## Environment Variables

Create a `.env` file in the backend directory:

\`\`\`
SECRET_KEY=your-django-secret-key
DEBUG=True
TMDB_API_KEY=your-tmdb-api-key
\`\`\`

## Database Models

### CustomUser
- Extended Django User model with email authentication
- Additional fields: created_at, updated_at

### Movie
- TMDb movie data cached locally
- Fields: tmdb_id, title, overview, poster_path, etc.

### Favorite
- User-movie relationship for favorites
- Unique constraint on user-movie pairs



# Nexus Movie App - Django Backend

A modern movie discovery application with a Django REST API backend and Next.js frontend.

## Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Django REST Framework with JWT authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **External API**: The Movie Database (TMDb) API

## Setup Instructions

### Backend Setup (Django)

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Run migrations:
   \`\`\`bash
   python manage.py makemigrations
   python manage.py migrate
   \`\`\`

5. Create a superuser (optional):
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

6. Start the Django development server:
   \`\`\`bash
   python manage.py runserver
   \`\`\`

The Django API will be available at `http://143.110.152.152:8002/`


## Deploy on digital ocean


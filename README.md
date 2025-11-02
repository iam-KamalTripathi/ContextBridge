# NextStep - AI Career Guidance Platform

A psychologically valid, AI-driven career counselling system that helps users identify suitable career paths based on quiz responses and chat conversations.

## Features

✅ RIASEC interest quiz  
✅ AI chatbot powered by Gemini Free API  
✅ Dynamic career recommendation API  
✅ User authentication + history tracking  
✅ Modern responsive UI (React + Tailwind) with dark/light themes  

## Tech Stack

- **Frontend**: React + TailwindCSS + Framer Motion
- **Backend**: Flask (Python) + Flask-CORS + Flask-SQLAlchemy
- **AI Layer**: Free Gemini API
- **Database**: SQLite (for local dev), scalable to PostgreSQL
- **Auth**: JWT-based authentication

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy the example environment file
cp env_example.txt .env

# Edit .env and add your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your-super-secret-key-change-this-in-production
```

5. Run the backend server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in frontend directory
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Run the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your backend `.env` file

## Project Structure

```
career-compass/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py             # Database models
│   ├── database.py           # Database configuration
│   ├── routes/               # API routes
│   │   ├── auth_routes.py
│   │   ├── quiz_routes.py
│   │   ├── chat_routes.py
│   │   └── recommendation_routes.py
│   ├── utils/                # Utility functions
│   │   └── gemini_client.py
│   ├── requirements.txt
│   └── env_example.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context providers
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/register` - Create new user
- `POST /api/login` - User login
- `POST /api/verify-token` - Verify JWT token

### Quiz
- `GET /api/quiz` - Get quiz questions
- `POST /api/submit-quiz` - Submit quiz answers

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat-history` - Get chat history

### Recommendations
- `GET /api/user/history` - Get user history
- `POST /api/contact` - Submit contact form
- `POST /api/recommend` - Generate recommendations

## Usage

1. **Register/Login**: Create an account or sign in
2. **Take Quiz**: Complete the RIASEC assessment
3. **View Results**: See your career recommendations
4. **Chat with AI**: Get personalized career guidance
5. **Track Progress**: Monitor your career development

## Development

### Running in Development Mode

Backend:
```bash
cd backend
python app.py
```

Frontend:
```bash
cd frontend
npm start
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@careercompass.ai or create an issue in the repository.

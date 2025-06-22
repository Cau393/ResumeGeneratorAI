# ResumeGeneratorAI
AI-Powered Resume & Portfolio Platform
A modern, scalable web platform designed to provide users with a suite of AI-powered tools for creating and enhancing professional resumes and portfolios. This project leverages a fully decoupled, containerized architecture deployed on AWS, built with industry-best-practices for performance, testing, and observability.

Live Demo: (Not ready yet)

Key Features
AI-Assisted Resume Builder: A premium feature allowing subscribed users to build a comprehensive resume from a structured form, with AI assistance to enhance written content in real-time.

AI Resume Enhancer: A "freemium" tool where any registered user can upload an existing resume (PDF) to receive a detailed AI-powered analysis, identifying strengths, weaknesses, and points for improvement. This serves as a funnel to the premium builder.

Subscription Model: Multi-tiered subscription plans (monthly, semi-annually, annually) managed securely through the Stripe payment gateway.

PDF Generation: Users can choose from multiple professional templates and download their final resume as a high-quality PDF.

Public REST API: A secure, key-authenticated public API that allows third-party services to programmatically utilize the resume analysis engine.

Technical Architecture
This application is built on a decoupled, microservice-inspired architecture designed for high availability and scalability. The frontend is a completely separate Single-Page Application (SPA) that communicates with a robust Django backend via a REST API.

 (Replace with a link to your architecture diagram image)

Technology Stack

Backend

Framework: Django 5.x (in ASGI mode)

API: Django REST Framework (DRF) with Nested Serializers

Application Server: Gunicorn managing Uvicorn workers for asynchronous performance.

Database: PostgreSQL

Authentication: dj-rest-auth with JWT for stateless token-based authentication.

Task Queue: Celery for handling long-running background tasks (AI processing, PDF generation).

AI Integration: Google Gemini API

Frontend

Framework: React 18 (with Hooks and Context API)

Routing: react-router-dom

API Client: axios

Styling: Tailwind CSS

DevOps & Cloud Infrastructure

Containerization: Docker & Docker Compose

Deployment Platform: AWS Elastic Beanstalk (PaaS)

Database: Amazon RDS for PostgreSQL with RDS Proxy for connection pooling.

Caching & Broker: Amazon ElastiCache for Redis

File Storage: Amazon S3 for user uploads and generated PDFs.

CI/CD: GitHub Actions for automated testing and deployment.

Monitoring: Amazon CloudWatch (Logs & Metrics) and AWS X-Ray (APM Tracing).

Getting Started (Local Development)
To get the project running on your local machine, ensure you have Git and Docker Desktop installed.

1. Clone the Repository

git clone https://github.com/Cau393/ResumeGeneratorAI.git

cd ResumeGeneratorAI

2. Configure Environment Variables

The project uses a .env file for managing sensitive keys. A template is provided.

# In the project root, copy the example file
cp .env.example .env

Now, open the .env file and fill in the placeholder values. For local development, you will need to at least configure SECRET_KEY and a local DATABASE_URL.

3. Launch the Application

The entire application stack (Django, Nginx, Database, etc.) is managed by Docker Compose.

docker-compose up --build

The application will now be available at http://localhost:8000.

API Documentation
The public-facing REST API is fully documented using OpenAPI standards. Once the server is running, the interactive API documentation (provided by Swagger UI) can be accessed at:

/api/docs/

Testing
This project follows a comprehensive, multi-layered testing strategy to ensure code quality and stability.

Unit Tests: Verify individual functions and components in isolation.

Integration Tests: Ensure that different parts of the application (e.g., views, serializers, database) work together correctly.

End-to-End (E2E) Tests: Simulate full user journeys in a real browser using Playwright.

To run the entire test suite, execute the following command:

docker-compose exec web python manage.py test


Contact: caueroriz@gmail.com



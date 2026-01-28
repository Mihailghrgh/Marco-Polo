FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Copy only backend_server folder
COPY backend_server/ .  

# Install dependencies
COPY backend_server/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 8080

# Start FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
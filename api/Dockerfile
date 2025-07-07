FROM python:3.11-slim

WORKDIR /app

# Set Python path to current directory
ENV PYTHONPATH=/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Run directly pointing to the module
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

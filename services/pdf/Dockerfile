FROM python:3.11-slim

WORKDIR /app

# copy app files
COPY requirements.txt . 
COPY app.py .

# install dependents
RUN pip install --no-cache-dir -r requirements.txt

# create dir 
RUN mkdir uploads

# expose service
EXPOSE 8080

# run service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from banks.ING_extract import ING_extract

app = FastAPI(title="PDF Data Extractor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lub ["*"] na testy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PdfUrlRequest(BaseModel):
    fileUrl: str
    bank: str

@app.post('/extract/')
async def extract_data_from_pdf(req: PdfUrlRequest):
    print("--------->")
    
    file_url = req.fileUrl
    bank = req.bank
    response = None

    try:
        if(bank == "ING"):
            response = await ING_extract(file_url)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Extract PDF error: {str(e)}")

    return response

import os
import pdfplumber
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI(title="PDF Data Extractor", version="1.0.0")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post('/extract')
async def extract_data_from_pdf(file: UploadFile=File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, details="Only PDF and CSV Files allowed")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, 'wb') as f:
        f.write(await file.read())

    extracted_data = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                table = page.extract_table()
                if table:
                    df = pd.DataFrame(table[1:], columns=table[0])
                    df['Page'] = page_num
                    extracted_data.append(df)
                else:
                    text = page.extract_text()
                    extracted_data.append(pd.DataFrame({"Page":[page_num], "Text":text}))


        if extracted_data:
            final_df = pd.concat(extracted_data, ignore_index=True)
            json_data = final_df.to_dict(orient="records")
        else:
            json_data = {"message":"No data"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extract PDF error: {str(e)}")
    finally:
        os.remove(file_path)

    return JSONResponse(content = json_data)
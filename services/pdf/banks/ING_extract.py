import io
import re
import requests
import pdfplumber
import numpy as np
import pandas as pd
from fastapi.responses import JSONResponse
import fitz 

async def ING_extract(url):

    r = requests.get(url)
    r.raise_for_status()
    pdf_bytes = io.BytesIO(r.content)
    # Wzorce do wykrywania kont bankowych

    # Wzorzec kwoty (PLN z minusem lub bez)
    amount_pattern = re.compile(r"(-?\d{1,3}(?:\s\d{3})*,\d{2})\sPLN")

    date_pattern = re.compile(r"(\d{2}\.\d{2}\.\d{4})")
    amount_pattern = re.compile(r"(-?\d{1,3}(?:\s\d{3})*,\d{2})\sPLN")
    arr = []

    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page_num, page in enumerate(doc, start=1):
            blocks = page.get_text("dict")["blocks"]
            row_data = {"date": None, "saldo": None, "amount": None}
            for b in blocks:
                if "lines" not in b:
                    continue
                for l in b["lines"]:
                    for s in l["spans"]:
                        text = s["text"].strip()
                        font = s["font"]

                        # Sprawdź, czy tekst jest pogrubiony
                        is_bold = "Bold" in font or "BLACK" in font.upper() or "Heavy" in font

                        if is_bold:
                            date_match = date_pattern.match(text)
                            if date_match:
                                row_data['date'] = date_match.group(1)


                            amount_match = amount_pattern.search(text)
                            if amount_match:
                                value = amount_match.group(1).replace(" ", "").replace(",", ".")
                                if row_data["amount"] is None:
                                    row_data["amount"] = value
                                else:
                                    row_data["saldo"] = value

                    if all([row_data['date'], row_data['amount'], row_data['saldo']]):
                        arr.append(row_data.copy()) 
                        row_data['date'] = None
                        row_data['amount'] = None
                        row_data['saldo'] = None

    first_date = arr[0]["date"]
    last_date = arr[-1]["date"]

    response = {
        "data": arr,
        "from": first_date,
        "to": last_date
    }
    return response


                        



    
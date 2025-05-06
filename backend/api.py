from fastapi import FastAPI
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

app = FastAPI()

# Load model từ thư mục đã train
agentS_model = T5ForConditionalGeneration.from_pretrained("agentS_out")
agentS_tokenizer = T5Tokenizer.from_pretrained("agentS_out")

agentA_model = T5ForConditionalGeneration.from_pretrained("agentA_out")
agentA_tokenizer = T5Tokenizer.from_pretrained("agentA_out")

# API schema 
class PassageRequest(BaseModel):
    passage: str
    num_questions: int = 3

class EvaluateRequest(BaseModel):
    passage: str
    statements: list[str]

# API 1: Generate statements 
@app.post("/generate_questions")
def generate_questions(data: PassageRequest):
    input_ids = agentS_tokenizer(
        [f"generate statement: {data.passage}"],
        return_tensors="pt"
    ).input_ids

    outputs = agentS_model.generate(
        input_ids,
        num_beams=5,
        num_return_sequences=data.num_questions,
        max_length=64
    )

    statements = [agentS_tokenizer.decode(o, skip_special_tokens=True) for o in outputs]
    return {"statements": statements}

# API 2: Evaluate statements
@app.post("/evaluate_answers")
def evaluate(data: EvaluateRequest):
    results = []

    for statement in data.statements:
        input_text = f"classify: premise: {data.passage} statement: {statement}"
        input_ids = agentA_tokenizer.encode(input_text, return_tensors="pt")
        output = agentA_model.generate(input_ids, max_length=128)
        decoded = agentA_tokenizer.decode(output[0], skip_special_tokens=True)

        if "|||" in decoded:
            label, explanation = decoded.split("|||", 1)
        else:
            label, explanation = decoded.strip(), ""

        results.append({
            "statement": statement,
            "label": label.strip(),
            "explanation": explanation.strip()
        })

    return {"results": results}

import os
import re
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import (
    pipeline,
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    DebertaV2Tokenizer,
    DebertaV2ForSequenceClassification
)

def load_env_file(path: str = ".env"):
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                os.environ.setdefault(key, val)
    except FileNotFoundError:
        pass

load_env_file()

app = FastAPI(title="TFNG Inference Service")

# đường dẫn từ .env
PATH_S        = os.getenv("PATH_AGENT_S")
PATH_A_TFNG   = os.getenv("PATH_AGENT_A_TFNG")
PATH_A_YNNG   = os.getenv("PATH_AGENT_A_YNNG")
PATH_E        = os.getenv("PATH_AGENT_E")

# 1) agentS – sinh statement
tokenizer_s = AutoTokenizer.from_pretrained(PATH_S, use_fast=False)
model_s     = AutoModelForSeq2SeqLM.from_pretrained(PATH_S)
pipe_s      = pipeline("text2text-generation", model=model_s, tokenizer=tokenizer_s)

# 2a) agentA_tfng – phân loại TFNG
tokenizer_a_tfng = DebertaV2Tokenizer.from_pretrained(PATH_A_TFNG, use_fast=False)
model_a_tfng     = DebertaV2ForSequenceClassification.from_pretrained(PATH_A_TFNG)
pipe_a_tfng      = pipeline("text-classification", model=model_a_tfng, tokenizer=tokenizer_a_tfng)

# 2b) agentA_ynng – phân loại YNNG (DeBERTa)
tokenizer_a_ynng = DebertaV2Tokenizer.from_pretrained(PATH_A_YNNG, use_fast=False)
model_a_ynng     = DebertaV2ForSequenceClassification.from_pretrained(PATH_A_YNNG)
pipe_a_ynng      = pipeline("text-classification", model=model_a_ynng, tokenizer=tokenizer_a_ynng)

# 3) agentE – sinh explanation
tokenizer_e = AutoTokenizer.from_pretrained(PATH_E, use_fast=False)
model_e     = AutoModelForSeq2SeqLM.from_pretrained(PATH_E)
pipe_e      = pipeline("text2text-generation", model=model_e, tokenizer=tokenizer_e)


# ----- Pydantic schemas -----
class GenStmtRequest(BaseModel):
    passage: str

class ClassifyRequest(BaseModel):
    passage: str
    statement: str

class ExplainRequest(BaseModel):
    passage: str
    statement: str
    label: str

class QuestionsRequest(BaseModel):
    passage: str
    num_questions: int = 6
    questionType: str = "TFNG"  # Giữ lại vì được truyền từ frontend

class EvaluateRequest(BaseModel):
    passage: str
    statements: List[str]
    questionType: str  # "TFNG" or "YNNG"


# ----- Endpoints -----


@app.post("/generate_statement")
def generate_statement(req: GenStmtRequest):
    prompt = "generate statement: " + req.passage
    out = pipe_s(prompt, max_length=64, num_return_sequences=1)
    return {"statement": out[0]["generated_text"]}


@app.post("/classify_tfng")
def classify_tfng(req: ClassifyRequest):
    # match train prompt: premise with prefix, hypothesis = statement
    premise = "Classify: " + req.passage
    hyp     = req.statement
    out     = pipe_a_tfng(premise, hyp)
    return {"label": out[0]["label"]}


@app.post("/classify_ynng")
def classify_ynng(req: ClassifyRequest):
    # match train prompt: hypothesis prefixed, premise prefixed
    hyp     = "Does the following statement agree with the passage? " + req.statement
    premise = "Passage: " + req.passage
    out     = pipe_a_ynng(hyp, premise)
    return {"label": out[0]["label"]}


@app.post("/generate_explanation")
def generate_explanation(req: ExplainRequest):
    prompt = (
        f"Label: {req.label}\n"
        f"Premise: {req.passage}\n"
        f"Hypothesis: {req.statement}\n"
        "Explanation:"
    )
    out = pipe_e(prompt, max_length=128, num_return_sequences=1)
    return {"explanation": out[0]["generated_text"]}


# Giữ nguyên mapping label như trước
TFNG_LABELS = ["FALSE", "NOT GIVEN", "TRUE"]
YNNG_LABELS = ["NO",    "NOT GIVEN", "YES"]

@app.post("/generate_questions")
def generate_questions(req: QuestionsRequest):
    qtype   = req.questionType.upper()   # "TFNG" hoặc "YNNG"
    passage = req.passage.strip()
    N       = req.num_questions

    # 1) Simple sentence-split bằng regex (ko cần nltk)
    raw_sents = re.split(r'(?<=[\.\?\!])\s+', passage)

    # 2) Chọn những câu gốc đủ dài (≥ 8 từ)
    candidates = [s for s in raw_sents if len(s.split()) >= 8]

    statements = []
    for sent in candidates:
        if len(statements) >= N:
            break

        # 3) “Làm mượt” câu qua agentS
        prompt = "generate statement: " + sent
        out = pipe_s(
            prompt,
            max_length=64,
            num_return_sequences=1,
            do_sample=False,          # beam search cho ổn định
            num_beams=4,
            no_repeat_ngram_size=2,
            early_stopping=True
        )
        stmt = out[0]["generated_text"].strip()

        # 4) Đảm bảo kết thúc bằng chấm
        if not stmt.endswith("."):
            stmt += "."

        # 5) Loại trùng & lọc quá ngắn
        lower_existing = [x.lower() for x in statements]
        if stmt.lower() not in lower_existing and len(stmt.split()) >= 5:
            statements.append(stmt)

    # 6) Fallback: nếu chưa đủ, lấy thẳng câu gốc
    i = 0
    while len(statements) < N and i < len(candidates):
        s = candidates[i].strip()
        if not s.endswith("."):
            s += "."
        if s.lower() not in [x.lower() for x in statements]:
            statements.append(s)
        i += 1

    return {"statements": statements}

def find_evidence(passage: str, statement: str) -> str:
    # Tách passage thành các câu
    sents = re.split(r'(?<=[\.\?\!])\s+', passage)
    # Tìm câu có nhiều từ chung nhất với statement
    stmt_tokens = set(re.findall(r"\w+", statement.lower()))
    best = max(sents, key=lambda s: len(stmt_tokens & set(re.findall(r"\w+", s.lower()))))
    return best.strip()

@app.post("/evaluate_answers")
def evaluate_answers(req: EvaluateRequest):
    try:
        passage = req.passage.strip()
        stmts   = req.statements
        n       = len(stmts)

        # 1) Batch classify
        texts = [f"premise: {passage} hypothesis: {s}" for s in stmts]
        if req.questionType.upper() == "TFNG":
            cls_outs = pipe_a_tfng(texts)
        else:
            cls_outs = pipe_a_ynng(texts)
        labels = [o["label"].upper() for o in cls_outs]

        # 2) Build explanations
        results = []
        for stmt, label in zip(stmts, labels):
            evidence = find_evidence(passage, stmt)

            if label in ("TRUE", "YES"):
                expl = (
                    f"Because the passage says “{evidence}”, "
                    f"it supports the statement that {stmt[0].lower() + stmt[1:]}"
                )
            elif label in ("FALSE", "NO"):
                expl = (
                    f"Because the passage says “{evidence}”, "
                    f"this contradicts the statement that {stmt[0].lower() + stmt[1:]}"
                )
            else:  # NOT GIVEN
                # Lấy subject/chủ ngữ của statement để chỉ rõ nội dung thiếu
                subj = re.match(r"^([A-Z][\w\s]+?)\b", stmt)
                subj_text = subj.group(1) if subj else stmt.rstrip(".")
                expl = (
                    f"Because the passage says “{evidence}”, "
                    f"but it does not mention {subj_text.lower()}, "
                    "so the information is not given."
                )

            # Ensure ending with period
            if not expl.endswith("."):
                expl += "."

            results.append({
                "statement":   stmt,
                "label":       label,
                "explanation": expl
            })

        return {"results": results}

    except Exception as e:
        import traceback
        return {
            "error":   str(e),
            "details": traceback.format_exc(),
            "message": "An error occurred during evaluation"
        }, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

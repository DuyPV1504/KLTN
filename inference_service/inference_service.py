import os
import re
import random
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import (
    pipeline,
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    DebertaV2Tokenizer,
    DebertaV2TokenizerFast,
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

PATH_S        = os.getenv("PATH_AGENT_S")
PATH_A_TFNG   = os.getenv("PATH_AGENT_A_TFNG")
PATH_A_YNNG   = os.getenv("PATH_AGENT_A_YNNG")
PATH_E        = os.getenv("PATH_AGENT_E")

tokenizer_s = AutoTokenizer.from_pretrained(PATH_S, use_fast=False)
model_s     = AutoModelForSeq2SeqLM.from_pretrained(PATH_S)
pipe_s      = pipeline("text2text-generation", model=model_s, tokenizer=tokenizer_s)

tokenizer_a_tfng = DebertaV2Tokenizer.from_pretrained(PATH_A_TFNG, use_fast=False)
model_a_tfng     = DebertaV2ForSequenceClassification.from_pretrained(PATH_A_TFNG)
pipe_a_tfng      = pipeline("text-classification", model=model_a_tfng, tokenizer=tokenizer_a_tfng)

tokenizer_a_ynng = DebertaV2Tokenizer.from_pretrained(PATH_A_TFNG, use_fast=False)
model_a_ynng     = DebertaV2ForSequenceClassification.from_pretrained(PATH_A_TFNG)
pipe_a_ynng      = pipeline("text-classification", model=model_a_ynng, tokenizer=tokenizer_a_ynng)

tokenizer_e = AutoTokenizer.from_pretrained(PATH_E, use_fast=False)
model_e     = AutoModelForSeq2SeqLM.from_pretrained(PATH_E)
pipe_e      = pipeline("text2text-generation", model=model_e, tokenizer=tokenizer_e)


TFNG_LABELS = [model_a_tfng.config.id2label[i].replace("_"," ").upper()
               for i in sorted(model_a_tfng.config.id2label)]
YNNG_LABELS = [model_a_ynng.config.id2label[i].replace("_"," ").upper()
               for i in sorted(model_a_ynng.config.id2label)]

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
    questionType: str = "TFNG"  

class EvaluateRequest(BaseModel):
    passage: str
    statements: List[str]
    questionType: str  


def find_evidence(passage: str, statement: str) -> str:
    sentences = re.split(r'(?<=[\.\?\!])\s+', passage)
    tokens = set(re.findall(r"\w+", statement.lower()))
    return max(sentences, key=lambda s: len(tokens & set(re.findall(r"\w+", s.lower())))).strip()

@app.post("/generate_questions")
def generate_questions(req: QuestionsRequest):
    qtype   = req.questionType.upper()
    passage = req.passage.strip()
    N       = req.num_questions

    raw_sents  = re.split(r'(?<=[\.\?\!])\s+', passage)
    candidates = [s.strip() for s in raw_sents if len(s.split()) >= 8]

    statements, seen = [], set()
    bad_starts  = {"rewrite", "rewriting", "write", "writing", "paraphrase", "paraphrasing"}
    pronouns    = {"this", "it", "these", "those", "they", "he", "she", "we"}
    bad_phrases = {"same way", "same wording", "following sentence",
                   "different wording", "single sentence", "one sentence"}

    for sent in candidates:
        if len(statements) >= N:
            break
        prompt = (
            f"Create one standalone {qtype} statement (grammatical, meaningful) that "
            f"could be asked about this content:\n\"{sent}\"\nStatement:"
        )
        out  = pipe_s(prompt, max_length=64, num_beams=6, do_sample=False,
                      no_repeat_ngram_size=2, early_stopping=True)
        stmt = out[0]["generated_text"].strip()
        if not stmt.endswith("."):
            stmt += "."
        low   = stmt.lower()
        first = low.split()[0].rstrip(".,")
        if (first in bad_starts or first in pronouns or low in seen or
            len(stmt.split()) < 6 or
            any(p in low for p in bad_phrases) or
            re.search(r"\b(\w+)\s+\1\b", low)):
            continue
        statements.append(stmt)
        seen.add(low)

    idx = 0
    while len(statements) < N and idx < len(candidates):
        s = candidates[idx]
        if not s.endswith("."):
            s += "."
        low = s.lower()
        if low not in seen:
            statements.append(s)
            seen.add(low)
        idx += 1

    return {"statements": statements}



@app.post("/evaluate_answers")
def evaluate_answers(req: EvaluateRequest):
    passage = req.passage.strip()
    stmts   = req.statements
    is_tfng = req.questionType.upper() == "TFNG"

    classifier = pipe_a_tfng if is_tfng else pipe_a_ynng
    label_map  = TFNG_LABELS if is_tfng else YNNG_LABELS

    scored = classifier(
        [{"text": passage, "text_pair": s} for s in stmts],
        return_all_scores=True
    )

    labels = []
    for scores in scored:
        scores.sort(key=lambda x: -x["score"])
        best   = scores[0]
        second = scores[1]["score"] if len(scores) > 1 else 0.0

        if best["label"].startswith("LABEL_"):
            idx  = int(best["label"].split("_")[1])
            lab  = label_map[idx]
        else:
            lab  = best["label"].upper().replace("_", " ")

        confident = best["score"] >= 0.50 and (best["score"] - second >= 0.15)
        if lab in ("TRUE", "FALSE", "YES", "NO") and not confident:
            lab = "NOT GIVEN"
        labels.append(lab)

    pos_tpl = [
        "\"{}\" supports \"{}\".",
        "\"{}\" confirms that \"{}\" is correct.",
        "\"{}\" proves \"{}\"."
    ]
    neg_tpl = [
        "\"{}\" contradicts \"{}\".",
        "\"{}\" shows the claim \"{}\" is wrong.",
        "Because the text says \"{}\", \"{}\" is false."
    ]
    ng_tpl = [
        "The passage never mentions \"{}\", so \"{}\" is not given.",
        "No information about \"{}\" appears; therefore \"{}\" cannot be judged.",
        "\"{}\" is not addressed in the text, leaving \"{}\" unresolved."
    ]

    results = []
    for stmt, lab in zip(stmts, labels):
        if lab in ("TRUE", "YES"):
            ev   = find_evidence(passage, stmt)
            expl = random.choice(pos_tpl).format(ev, stmt)
        elif lab in ("FALSE", "NO"):
            ev   = find_evidence(passage, stmt)
            expl = random.choice(neg_tpl).format(ev, stmt)
        else:
            ev    = find_evidence(passage, stmt)
            focus = re.search(r"^([A-Z][\w\s]+?)(?:\s+is|\s+are|\s+was|\s+were|$)", stmt)
            key   = focus.group(1).lower() if focus else stmt.lower().rstrip(".")
            expl  = (
            f"The passage says \"{ev}\", but it never mentions {key}, "
            f"so we cannot decide whether the statement \"{stmt}\" is true or false."
            )
        results.append({"statement": stmt, "label": lab, "explanation": expl})

    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

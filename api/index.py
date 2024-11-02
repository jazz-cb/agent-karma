from flask import Flask
from .agents import interact_with_aave

app = Flask(__name__)

class ActionRequest:
    action: str # "supply" or "borrow" or "repay" or  "withdraw"
    amount: str

@app.post("/aave")
async def handle_aave_action(request: ActionRequest):
    return interact_with_aave(request)

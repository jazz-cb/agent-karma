from flask import Flask
from .agents import  supply_usdc_to_aave, borrow_usdc_from_aave, repay_usdc_to_aave, withdraw_usdc_from_aave

app = Flask(__name__)

class ActionRequest:
    action: str # "supply" or "borrow" or "repay" or  "withdraw"
    amount: str

@app.post("/aave")
async def handle_aave_action(request: ActionRequest):
    if request.action == "supply":
        return supply_usdc_to_aave(request.amount)
    elif request.action == "borrow":
        return borrow_usdc_from_aave(request.amount)
    elif request.action == "repay":
        return repay_usdc_to_aave(request.amount)
    elif request.action == "withdraw":
        return withdraw_usdc_from_aave(request.amount)

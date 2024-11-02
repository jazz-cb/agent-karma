from .agents import  supply_usdc_to_aave, borrow_usdc_from_aave, repay_usdc_to_aave, withdraw_usdc_from_aave

from flask import Flask, request, jsonify
from agents.lending_agent import LendingAgent

app = Flask(__name__)
lending_agent = LendingAgent()

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

@app.route("/api/lending/pools", methods=["GET"])
async def get_pools():
    try:
        pools = await lending_agent.get_pools()
        return jsonify(pools)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'pools': []
        }), 500

@app.route("/api/lending/lend", methods=["POST"])
async def lend():
    data = request.json
    result = await lending_agent.lend(
        asset=data['asset'],
        token_amount=float(data['tokenAmount']),
        pool_address=data['poolAddress']
    )
    return jsonify(result)
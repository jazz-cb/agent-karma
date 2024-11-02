from agents import supply_usdc_to_aave, borrow_usdc_from_aave, repay_usdc_to_aave, withdraw_usdc_from_aave

from flask import Flask, request, jsonify
from dataclasses import dataclass

app = Flask(__name__)

@dataclass
class ActionRequest:
    action: str
    amount: str

@app.post("/api/aave")
async def handle_aave_action():
    data = request.get_json()
    req = ActionRequest(
        action=data.get('action'),
        amount=data.get('amount')
    )
    
    try:
        if req.action == "supply":
            print(f"Supplying {req.amount} USDC to Aave")
            result =  supply_usdc_to_aave(1)
            print(result)
            return jsonify({"success": True, "response": result})
            
        elif req.action == "borrow":
            result =  borrow_usdc_from_aave(req.amount)
            return jsonify({"success": True, "response": result})
            
        elif req.action == "repay":
            result =  repay_usdc_to_aave(req.amount)
            return jsonify({"success": True, "response": result})
            
        elif req.action == "withdraw":
            result =  withdraw_usdc_from_aave(req.amount)
            return jsonify({"success": True, "response": result})
            
        else:
            return jsonify({
                "success": False, 
                "error": "Invalid action"
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False, 
            "error": str(e)
        }), 500

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
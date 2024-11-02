from flask import Flask, request, jsonify
from agents.lending_agent import LendingAgent

app = Flask(__name__)
lending_agent = LendingAgent()

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
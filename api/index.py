from agents import supply_usdc_to_aave, borrow_usdc_from_aave, repay_usdc_to_aave, withdraw_usdc_from_aave

from flask import Flask, request, jsonify
from dataclasses import dataclass
from flask_sock import Sock
from swarm import Swarm
from agents import reputation_agent
import json

app = Flask(__name__)
sock = Sock(app)

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

@sock.route('/ws/chat')
def chat_socket(ws):
    client = Swarm()
    messages = []
    
    while True:
        try:
            # Receive message from client
            message_data = ws.receive()
            print(f"Received message: {message_data}")
            
            # Parse the message
            user_message = json.loads(message_data)
            messages.append(user_message)
            
            # Run the agent
            response = client.run(
                agent=reputation_agent, 
                messages=messages,
                stream=True
            )
            
            # Accumulate the response content
            accumulated_content = ""
            
            # Stream the response
            for chunk in response:
                try:
                    if chunk.get("content"):
                        # Accumulate content instead of sending immediately
                        accumulated_content += chunk["content"]
                    
                    if chunk.get("tool_calls"):
                        for tool_call in chunk["tool_calls"]:
                            ws.send(json.dumps({
                                "type": "tool_call",
                                "data": tool_call
                            }))
                    
                    if chunk.get("response"):
                        messages.extend(chunk["response"].messages)
                        
                except Exception as e:
                    print(f"Error processing chunk: {e}")
                    continue
            
            # Send the accumulated content as a single message
            if accumulated_content:
                ws.send(json.dumps({
                    "type": "content",
                    "data": accumulated_content.strip()
                }))
                    
        except Exception as e:
            print(f"WebSocket error: {e}")
            break
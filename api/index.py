from flask import Flask
app = Flask(__name__)

@app.route("/api/reputation")
def agent_info():
    return "Agent info"
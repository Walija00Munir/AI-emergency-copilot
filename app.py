@app.route("/")
def index():
    with open("public/index.html") as f:
        return f.read()

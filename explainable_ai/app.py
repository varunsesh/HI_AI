from flask import Flask, request, render_template, redirect
from explain import predict_covid_explainability

app = Flask(__name__)



@app.route("/", methods=["GET", "POST"])
def home():
    return (predict_covid_explainability("../views/uploads/xray.png"))





if __name__=="__main__":
    app.run(debug=True)
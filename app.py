from flask import Flask, render_template, redirect, request, url_for
from pymongo import MongoClient
from bson.objectid import ObjectId


app = Flask(__name__)


client = MongoClient("mongodb://localhost:27017/")
db = client["student_db"]
collection = db["students"]



@app.route("/")
def index():
    students = list(collection.find())
    return render_template("index.html", students=students)

@app.route("/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        student = {
            "SRN": request.form["SRN"],
            "Sname": request.form["Sname"],
            "Degree": request.form["Degree"],
            "Sem": int(request.form["Sem"]),
            "CGPA": float(request.form["CGPA"]),
        }
        collection.insert_one(student)
        return redirect(url_for("index"))
    return render_template("create.html")

@app.route("/read/<student_id>")
def read(student_id):
    student = collection.find_one({"_id": ObjectId(student_id)})
    return render_template("read.html", student=student)

@app.route("/update/<student_id>", methods=["GET", "POST"])
def update(student_id):
    if request.method == "POST":
        updated_student = {
            "$set": {
                "SRN": request.form["SRN"],
                "Sname": request.form["Sname"],
                "Degree": request.form["Degree"],
                "Sem": int(request.form["Sem"]),
                "CGPA": float(request.form["CGPA"]),
            }
        }
        collection.update_one({"_id": ObjectId(student_id)}, updated_student)
        return redirect(url_for("index"))

    student = collection.find_one({"_id": ObjectId(student_id)})
    return render_template("update.html", student=student)

@app.route("/delete/<student_id>")
def delete(student_id):
    collection.delete_one({"_id": ObjectId(student_id)})
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)

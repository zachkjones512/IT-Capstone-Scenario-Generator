from flask import Flask, request, send_file #using flask for webserver
from pptx import Presentation
import os

app = Flask(__name__) #creates flask application
pres = Presentation()
inputs = []
saveName = 'test.pptx'
files = [5]

@app.route('/submission', methods=['POST']) #user clicks submit on any of the questions
def submission():
    usrStr = request.form.get('input', default="DEFAULT", type=str) #submission button sends post request with answer
    inputs.append(usrStr)
    return "Input received, " + inputs[0]

@app.route('/complete', methods=['GET']) #user completes the questionnaire
def complete():
    if not inputs:
        return "No inputs received. Please submit some data first.", 400 

    title_slide_layout = pres.slide_layouts[0]
    slide = pres.slides.add_slide(title_slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1] #creates presentation with default layout
    print("Created presentation")

    title.text = "Cybersecurity Scenario!"
    subtitle.text = "for " + inputs[0] + "'s class" #adds the user input into the presentation
    try:
        pres.save(saveName)
        print("Saved successfully")
    except:
        return "Error saving presentation", 500
    
    inputs.clear()

    try:
        path = "../" + saveName
        return send_file(path, mimetype='pptx', as_attachment=True, download_name=saveName)
    except:
        return "Error uploading file. Please try again later."




if __name__ == '__main__':
    app.run(port=8080) #listens on port 8080

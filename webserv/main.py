from flask import Flask, request, send_file #using flask for webserver
from pptx import Presentation

app = Flask(__name__) #creates flask application
pres = Presentation()
inputs = []
saveName = 'test.pptx'

@app.route('/submission', methods=['POST']) #user clicks submit on any of the questions
def submission():
    usrStr = request.args.get(input, default="DEFAULT", type=str) #submission button sends post request with answer
    inputs.append(usrStr)

@app.route('/complete', methods=['GET']) #user completes the questionnaire
def complete():
    title_slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(title_slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1] #creates presentation with default layout

    title.text = "Test presentation!"
    subtitle.text = inputs[0] #adds the user input into the presentation

    pres.save(saveName)
    inputs.clear()

    try:
        path = saveName
        return send_file(path, mimetype='pptx', as_attachment=True, download_name=saveName)
    except:
        return "Error uploading file. Please try again later."




if __name__ == '__main__':
    app.run(port=8080) #listens on port 8080

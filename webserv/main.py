from flask import Flask, request, send_file #using flask for webserver
from pptx import Presentation
import pyzipper, os

app = Flask(__name__) #creates flask application
pres = Presentation()
inputs = []
presName = 'test.pptx'
files = [5]
directoryName = "scenario.zip"

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
        pres.save(presName)
        print("Saved successfully")
    except:
        return "Error saving presentation", 500
    
    with pyzipper.AESZipFile("archive.zip", 'w', compression=pyzipper.ZIP_LZMA, encryption=pyzipper.WZ_AES) as zipf:
        zipf.setpassword(inputs[0].encode("utf-8"))
        with open("test.txt", 'w') as file:
            file.write("We did it!\n")
        zipf.write("test.txt")
        print("Password set")

    with pyzipper.ZipFile(directoryName, 'w', compression=pyzipper.ZIP_LZMA) as zipf:
        zipf.write("archive.zip")
        zipf.write(presName)
        os.remove("test.txt")
        os.remove("archive.zip")
        os.remove(presName)

    inputs.clear()

    try:
        return send_file("../" + directoryName, mimetype='zip', as_attachment=True, download_name=directoryName)
    except:
        return "Error uploading file. Please try again later."




if __name__ == '__main__':
    app.run(port=8080) #listens on port 8080


/*NEEDS INPUT VALIDATION ON FORM */
document.addEventListener("DOMContentLoaded", () => {
    
    const questions = [
        "First, what is your name?",
        "Now, type in another full name, first and last",
        "Excellent choice! This time, enter in a noun",
        "Enter in a single one digit number",
        "Enter in a color",
        "Enter the name of a city",
        "Finally, enter in a food"
    ];

    let responses = []; 
    let questionIndex = 0;

    const currQuestion= document.getElementById("question");
    const currInput= document.getElementById("input");    
    const nextBtn= document.getElementById("btn");

    function updateQuestion(){
        if (questionIndex < questions.length) {
            currQuestion.textContent = questions[questionIndex];
            currInput.value = ""
            currInput.focus()
        }
        else {
            postResponse();
        }
    }

    nextBtn.addEventListener("click", () =>{
        const usrInput = currInput.value.trim();
        if (usrInput) {
            responses.push(usrInput); 
            console.log(usrInput)
            questionIndex++;
            updateQuestion();
        }
    });

    //need to add a condition that confirms an input was made.
    async function postResponse(){

        event.preventDefault();
        nextBtn.disabled = true    //disable form
        currInput.disabled = true;
        currQuestion.textContent = "Generating your challenge..."

        try {
        const poster = await fetch("/submission", { //sends responses
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ responses }) 
        })
    
        if (!poster.ok){
            throw new Error ("Server couldn't process your responses")
        }

        const result = await poster.text();
        if (result !== "inputs received") {
            throw new Error("Server didn't confirm completion");
        }

        await createDirectoryAndFetchFile();


        } catch (error) {
            setTimeout (() => {
                console.error("Error: ", error);
                currQuestion.textContent = `Uh oh! We ran into an error: ${error.message}.`;
                nextBtn.textContent = "Try again?";
                nextBtn.disabled = false;
                nextBtn.addEventListener("click", postResponse, { once: true });

            }, 500);
        }

    }

    async function createDirectoryAndFetchFile() {
        const getter = await fetch('/complete');
        if (!getter.ok) {
            throw new Error("Failed to generate file");
        }

        const file = await getter.blob();
        const fileUrl = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = "Scenario.zip";
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(fileUrl);
            currQuestion.textContent = "Now Downloading File... Good Luck!"
            
            nextBtn.textContent = "Restart";
            nextBtn.disabled = false;
            nextBtn.addEventListener("click", () =>{responses = []; questionIndex = 0; window.location.href = "/" + "?reset=" + Date.now()}, { once: true });

        }, 100);
    }
});
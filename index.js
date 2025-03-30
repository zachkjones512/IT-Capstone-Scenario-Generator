
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
            currInput.value = "";
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
    function postResponse(){
        fetch("/submission", { //sends responses
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ responses }) 
        })
        fetch('/complete', { //downloads responses
            method: 'GET',
        })
        .then(response => {
            if (response.ok) {
                return response.blob(); //gets file as blob
            } else {
                throw new Error('File download failed');
            }
        })
        .then(blob => {
            const link = document.createElement('a'); //creates an anchor element that will have the download link
            const url = URL.createObjectURL(blob); //creates a file url for the blob
            link.href = url;
            link.download = 'CybersecurityScenario.zip'; //filename
            
            document.body.appendChild(link); //puts the anchor element with the file url in the body
            link.click(); //click on link

            document.body.removeChild(link); //remove link and url
            URL.revokeObjectURL(url);
        })
    }
});
//Variables 
let para = document.getElementById('text');
let text = 'Aspiring Developer & Tech Enthusiast';
let type_seed = 80;      
let delete_speed = 50;   
let pause_duration = 1500;
let i = 0;
let deleting = false; 

//Function to mimic a typewriter
function typewriter() {
    //Delay variable
    let delay = 0;

    //Checks if the the text is being deleted
    if (deleting) {
        //Only brings the currect section of the text
        para.textContent = text.substring(0, i - 1);
        i--;
        delay = delete_speed;

        //Stops deleting and pauses
        if (i === 0){
            deleting = false;
            delay = pause_duration
        }
    }
    else{
        //Clear the paragraph at the start
        if (i === 0){
            para.textContent  = ''; 
        }

        //Appends the the respective letter
        para.textContent +=  text[i] ;
        i++
        delay = type_seed

        //Checks if the phrase is fully typed
        if (i === text.length){
            deleting = true;
            delay = pause_duration;
        }
    
    }
    //Calls the function with its respective delay
    setTimeout(typewriter, delay);
}

//Initailly starts the function
typewriter();


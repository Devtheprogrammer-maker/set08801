//Variables
let score = 0; 
let speed = 30;
let High_Score = 0;
let sound = true;
let obstacleImages = ['../img/knife.png', '../img/blender.png'];
let obstacle_interval, collision_interval, score_interval;


//Stop the space bar from scrolling down
function remove_default(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        check_jump();
    }
}

document.addEventListener('keydown', remove_default);

//Gets Element
let obstacle = document.getElementById('obstacle');

//Moves Obastacle
function move_obstacle(){
    //Gets obstacle position
    let styles = window.getComputedStyle(obstacle);
    let obstacle_pos = parseInt(styles.getPropertyValue('left'));
    
    //Gets Obstacle width
    let obstacle_width = obstacle.getBoundingClientRect().width;

    //Condition to move and reset obstacle
    if (obstacle_pos + obstacle_width > 0){
        obstacle.style.left = (obstacle_pos - 5) + 'px';
    }
    else{
        //Gets div width to reset obstacle
        let div_width = document.getElementById('runner_game').getBoundingClientRect();
        obstacle.style.left = (div_width.width - obstacle_width) + 'px';
        //Chooses random obstacle image
        obstacle.style.backgroundImage = 'url(' + random_image() + ')';
        
    }   
}


//Getts a random image index
function random_image() {
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    return obstacleImages[randomIndex];
}


//Gets element 
let runner = document.getElementById('runner');
let jumping = false;

//If sreen is tapped or key is pressed then jump
document.addEventListener('keypress', check_jump);
document.addEventListener('touchstart', check_jump); 

//Checks if the carrot is jumping and plays a note if true
function check_jump(){
    if (!jumping){
        jump();
        if (sound) {
            music();
        }
    }
}

//Function to jump 
function jump(){
    //Variable
    jumping = true; 

    //Finds carrot bottom position and sets max jump value
    let runner_start_bottom = parseInt(window.getComputedStyle(runner).getPropertyValue('bottom'));
    let max_jump = runner_start_bottom + 80;

    //Calls going up every 20 ms
    let riseing = setInterval(goingup, 20);

    //Function to go up
    function goingup(){
        //Gets the carrot possion
        let runner_bottom = parseInt(window.getComputedStyle(runner).getPropertyValue('bottom'));

        //Checks if the carrot has reached maximum jump height
        if (runner_bottom < max_jump) {
            runner.style.bottom = (runner_bottom + 5) + 'px';
        } else {
            clearInterval(riseing);
            fall();
        }
    }

    //Fuction to descend the carrot
    function fall(){
        //Bring the carrot down every 20 ms
        let desending = setInterval(goingdown, 20);

        //function to go down
        function goingdown(){
            //Gets current position
            let runner_bottom = parseInt(window.getComputedStyle(runner).getPropertyValue('bottom'));

            //Checks if the carrot is still mid air and descends
            if (runner_bottom > 0) {
                runner.style.bottom = (runner_bottom - 5) + 'px';
            } else {
                clearInterval(desending);
                runner.style.bottom = '0px';
                jumping = false;
            }
        }
    }
}


//Sound for the jump
function music(){

    //Creats an audio context
    var context = new(window.AudioContext || window.webkitAudioContext)();

    //Creates gain for volume
    var gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(1, context.currentTime);
    //Fades in and out the sound
    gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime (0, context.currentTime + 0.2)

    //Creates an oscillator to generate the sound
    var oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 220;
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
}


//Function fot collision
function check_collision() { 
    //Gets the positions
    let runner_rect = runner.getBoundingClientRect();
    let obstacl_rect = obstacle.getBoundingClientRect();

    //Checks if the carrot and obstacle overlap
    if (
        runner_rect.left < obstacl_rect.right &&
        runner_rect.right > obstacl_rect.left &&
        runner_rect.top < obstacl_rect.bottom &&
        runner_rect.bottom > obstacl_rect.top
    ) {
        store_score();
        alert('Collision Detected! Your Score was: ' + score);
        let div_width = document.getElementById('runner_game').getBoundingClientRect();
        obstacle.style.left = (div_width.width) + 'px';
        score = 0;
        speed = 30;
        stop_game(); 
    }
}



//Calculate Score
function calculate_score(){
    //Variable
    score ++;
    //Gets the first p tag of score
    p = document.getElementById('score').getElementsByTagName('p')[0];

    //Updates the color of text and plays a sound
    if (score <= 499){
        p.style.color = 'brown';
    }else if (score <= 999){
        p.style.color = 'silver';
        if (speed > 10){
            speed -= 5;
            start_game();
            console.log(speed);
            if (sound) {
                finish();
            }   
        }
    }else{
        p.style.color = 'gold'
        if (speed > 5){
            speed -= 5; 
            start_game();
            console.log(speed);
            if (sound) {
                finish();
            } 
        }
    }
    p.innerHTML = score;
}

//Music for Endgame
function finish(){
    //Creates an audio context
    var audio = new (window.AudioContext || window.webkitAudioContext)();

    //Variables
    let position = 0;
    let melody;

    //Maps letters to frequencies
    scale = {        
        c: 261,   
        e: 329,   
        g: 391,   
        C: 523,   
    },

    //The song sequence
    song = "c-e-C";
    
    //Plays a note every 250ms 
    melody = setInterval(play, 1000 / 4);

    //Function to create and play a single note
    function createOscillator(freq) {
        //How fast volume goes up  and down
        var attack = 10,      
        decay = 250,       

        //For volume control
        gain = audio.createGain(), 
        // Actual sound generator         
        osc = audio.createOscillator();     

        //Connect to speaker
        gain.connect(audio.destination);

        //Fade in
        gain.gain.setValueAtTime(0, audio.currentTime);
        gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000);
        //Fade out
        gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);

        //Set note frequency + type
        osc.frequency.value = freq;
        osc.type = "triangle";

        osc.connect(gain);

        //Start oscillator
        osc.start(0);
        
        //Stop oscillator after decay ends
        setTimeout(function(){
            osc.stop(0);
            osc.disconnect(gain);
            gain.disconnect(audio.destination);
        }, decay);
    }

    //Plays the current note in the song
    function play() {
        var note = song.charAt(position),
            freq = scale[note];

        //Sets position if done
        if (position >= song.length) {
            position = 0;
        }

        //Only play if it's a note
        if (freq) {
            createOscillator(freq);
        }

        //Move to next character
        position++;

        //Stop melody once full string is read
        if (position >= song.length){
            clearInterval(melody);
        }
    }
}


//Function to store score
function store_score(){
    //Gets element
    const highest_score = document.getElementById("stored_score");

    //Stores score if the current score is higher than the previous one
    if (typeof(Storage) !== "undefined") {

        //Gets the current highest score if stored
        let stored_score = localStorage.getItem('High_Score');

        //Converts the stored score into a int type
        if (stored_score === null) {
            stored_score = 0;
        } else {
            stored_score = parseInt(stored_score);
        }

        //Stores and prints score
        if(score > stored_score){
            localStorage.setItem('High_Score', score);
            highest_score.innerHTML = score;
        }
    } else {
        highest_score.innerHTML = "Sorry, no Web storage support!";
    }
}


//Function to load the score
function load_high_score() {
    //Gets element
    const stored = localStorage.getItem('High_Score');
    if (stored !== null) {
        document.getElementById('stored_score').innerHTML = stored;
    }
}

// Call load_high_score() function when game loads
load_high_score();


//Stops all intervals; stopping the game
function stop_game(){
    clearInterval(obstacle_interval);
    clearInterval(collision_interval);
    clearInterval(score_interval);
}


function start_game(){
    // clearInterval(obstacle_interval);
    // clearInterval(collision_interval);
    // clearInterval(score_interval);

    //Calls the stop_game() function
    stop_game();

    //Starts the interval with new values
    obstacle_interval = setInterval(move_obstacle, speed);
    collision_interval = setInterval(check_collision, speed);
    score_interval = setInterval(calculate_score, speed);
}


//Function to change mute icon
function mute(){
    //Sets sound to the oposite of its value
    sound = !sound;
    
    //Gets element
    const mute_icon = document.getElementById('mute_icon');

    //Updates icon accordingly
    if (sound === true) {
        mute_icon.classList.remove('fa-volume-xmark');
        mute_icon.classList.add('fa-volume-high'); 
    } else {
        mute_icon.classList.remove('fa-volume-high');
        mute_icon.classList.add('fa-volume-xmark');
    }
}
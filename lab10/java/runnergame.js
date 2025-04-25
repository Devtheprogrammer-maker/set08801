let score = 0; 
let speed = 30;
let obstacle_interval, collision_interval, score_interval;
let sound = true;
let High_Score = 0;

//Moves Obstacle
let obstacle = document.getElementById('obstacle');

function move_obstacle(){
    let styles = window.getComputedStyle(obstacle);
    let obstacle_pos = parseInt(styles.getPropertyValue('left'));

    if (obstacle_pos > 0){
        obstacle.style.left = (obstacle_pos - 5) + 'px';
    }
    else{
        obstacle.style.left = '480px';
        
    }   
}

//Make the runner jump 
let runner = document.getElementById('runner');
let jumping = false;

document.addEventListener('keypress', check_jump);
document.addEventListener('touchstart', check_jump); 

function check_jump(){
    if (!jumping){
        jump();
        if (sound) {
            music();
        }
    }
}


function jump(){
    let highest_jump = 80;
    jumping = true; 

    let riseing = setInterval(goingup, 20);

    function goingup(){
        let runner_pos = parseInt(window.getComputedStyle(runner).getPropertyValue('top'));
        if (runner_pos > highest_jump){
            runner.style.top = (runner_pos - 5) +'px';
        } else {
            clearInterval(riseing);
            fall();
        }
    }

    function fall(){
        let desending = setInterval(goingdown, 20);

        function goingdown(){
            let runner_pos = parseInt(window.getComputedStyle(runner).getPropertyValue('top'));
            if (runner_pos < 150){
                runner.style.top = (runner_pos + 5) + 'px';
            } else {
                clearInterval(desending);
                runner.style.top = '150px';
                jumping = false;
            }
        }
    }
}

//Collision
function check_collision(){ 
    current_runner_pos = parseInt(window.getComputedStyle(runner).getPropertyValue('top'));
    current_obstacle_pos = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    if ((current_runner_pos === 150 || current_runner_pos === 130) && current_obstacle_pos >= 40 && current_obstacle_pos <= 60){
        store_score();
        alert('Collision Detected! Your Score was: ' + score);
        obstacle.style.left = '480px'
        score = 0;
        speed = 30;
        stop_game();
        
    }
}


//Calculate Score
function calculate_score(){
    score ++;
    p = document.getElementById('score').getElementsByTagName('p')[0];

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

function store_score(){
    const highest_score = document.getElementById("stored_score");

    if (typeof(Storage) !== "undefined") {
        let stored_score = localStorage.getItem('High_Score');

        if (stored_score === null) {
            stored_score = 0;
        } else {
            stored_score = parseInt(stored_score);
        }

        if(score > stored_score){
            localStorage.setItem('High_Score', score);
            highest_score.innerHTML = score;
        }
    } else {
        highest_score.innerHTML = "Sorry, no Web storage support!";
    }
}


function load_high_score() {
    const highest_score_display = document.getElementById("stored_score");

    if (typeof(Storage) !== "undefined") {
        let stored_score = localStorage.getItem("High_Score");

        if (stored_score === null) {
            highest_score_display.innerHTML = 0;
        } else {
            highest_score_display.innerHTML = stored_score;
        }
    } else {
        highest_score_display.innerHTML = "Sorry, no Web storage support!";
    }
}


// Call load_high_score() when your game initializes
load_high_score();


function stop_game(){
    clearInterval(obstacle_interval);
    clearInterval(collision_interval);
    clearInterval(score_interval);
}

function start_game(){

    clearInterval(obstacle_interval);
    clearInterval(collision_interval);
    clearInterval(score_interval);

    obstacle_interval = setInterval(move_obstacle, speed);
    collision_interval = setInterval(check_collision, speed);
    score_interval = setInterval(calculate_score, speed);
}


// Music for Jump
function music(){
    var context = new(window.AudioContext || window.webkitAudioContext)();

    var gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(1, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime (0, context.currentTime + 0.2)

    var oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 220;
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
}

//Music for Endgame
function finish(){
    var audio = new ( window.AudioContext || window.webkitAudioContext )();
    let position = 0;
    let melody;
    scale = {        
        c: 261,
        e: 329,
        g: 391,
        C: 523,
},
    song = "c-e-C";
    
    melody = setInterval (play , 300);

    function createOscillator(freq) {
        //How nodes fade in
        var attack = 10,
        //Fade out
        decay = 250 ,

        gain = audio.createGain(),
        osc = audio.createOscillator();
        //Speaker
        gain.connect(audio.destination);

        gain.gain.setValueAtTime(0, audio.currentTime);
        gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000);
        gain.gain.linearRampToValueAtTime (0, audio.currentTime + decay / 1000) ;

        osc.frequency.value = freq;
        osc.type = "triangle";

        osc.connect(gain);

        
        osc.start(0);
        
        setTimeout(function(){
            osc.stop(0);
            osc.disconnect(gain);
            gain.disconnect(audio.destination);
        }, decay)
    }

    function play() {
        var note = song.charAt(position),
        freq = scale[note];
        if(position >= song.length) {
            position = 0;
        }
        if(freq) {
            createOscillator (freq);
        }
        position ++;
        if (position >= song.length){
            clearInterval(melody);
        }
    }
}

function mute(){
    sound = !sound;
    // Optional: add visual feedback (e.g., change the icon)
    const mute_icon = document.getElementById('mute_icon');
    if (sound === true) {
        mute_icon.classList.remove('fa-volume-xmark');
        mute_icon.classList.add('fa-volume-high'); 
    } else {
        mute_icon.classList.remove('fa-volume-high');
        mute_icon.classList.add('fa-volume-xmark');
    }
}


//Variables
let max = 100; 
let score = 0;
let time = 10; 
let health = 5;
let eq, answer, num1, num2, operator, timer; 
const operations = ['+', '-', '*', '/'];
let hp = document.getElementById('my_health').getElementsByTagName('p')[0];
let helicopter_interval = null; 
let monster_interval = null;
let monster_health = 2; //Change to 10


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The popup works with enter
function check_enter(event) {
    if (event.key === 'Enter') {
        hide_popup();
        document.removeEventListener('keydown', check_enter); 
    }
}
document.addEventListener('keydown', check_enter);


//Popup
function hide_popup(){

    //Gets Max Vaule
    max = parseInt(document.getElementById('max_num').value);
    console.log(max);

    //Checks if it is a number and if it more that 1
    if (isNaN(max) || max < 1){

        //Changes popup text value
        document.getElementsByTagName('p')[0].innerHTML = "Please enter a valid number";
    }
    else {

        //Changes CSS styling for popup and math game section 
        document.getElementById('popup').style.display = 'none';
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
        
    }    
}


function start_game(){

    generate_num(max);

    operator = random_operator(operations);

    eq = form_equation(num1,num2,operator);
    console.log(eq);

    let raw_answer = calculate_answer(num1, num2, operator);

    if (raw_answer === null) {
        answer = 'undefined';
    } else {
        answer = Math.floor(raw_answer);
    }
    console.log(answer);
    display_eq(); 
    display_initial_time();
    timer = setInterval(calculate_time, 1000)

}

//document.addEventListener('keydown', start_game)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generates Numbers
function generate_num(num){

    num1 = Math.floor(Math.random() * num);
    console.log(num1);
    
    num2 = Math.floor(Math.random()* num);
    console.log(num2);  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Genreates Random Operator
function random_operator(operator_array){

    random = Math.floor(Math.random() * operator_array.length);

    operator = operator_array[random];
    console.log(operator);
    return operator;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Formulates Equation
function form_equation(num1, num2, operator){

    equation = num1 + ' ' + operator + ' ' + num2;
    return equation
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Calculate answer 
function calculate_answer(num1, num2, operator) {

    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0 ){
                ans = null;
            }else{
                ans = num1 / num2;
            }
            return ans; 
        default:
            return null;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Display equation
function display_eq(){

    let container = document.createElement('div');

    let h1 = document.createElement('h1');
    h1.innerText = 'Please solve the following:';
    
    let para = document.createElement("p");
    para.innerText = eq + ' ' +  '=';

    let input = document.createElement('input');
    input.id = 'user_ans';
    input.type = 'text';
    input.style.marginLeft = '10px';
    input.placeholder = 'enter answer here';

    let btn = document.createElement('button');
    btn.innerText = "Submit";
    btn.onclick = function () {
        check_ans(answer);
    };

    container.appendChild(h1)
    container.appendChild(para);
    container.appendChild(input);
    container.appendChild(btn);
    container.style.textAlign = 'center';

    document.getElementById('equation').appendChild(container);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function check_ans(correct_answer){

    user_ans = parseFloat(document.getElementById('user_ans').value);
    console.log(user_ans);

    let feedback = document.getElementById('feedback'); 
    //feedback.innerHTML=''; 
    let para = document.createElement('p');
    

    if (correct_answer === user_ans && time >= 0){

        console.log('correct');

        para.innerText = 'Good Job! Moving to next question.';
        para.style.color = 'green';
        para.style.textAlign = 'center';
        feedback.appendChild(para);
        clearInterval(timer);

       
        clearInterval(helicopter_interval);
        helicopter_interval = null;
       
        helicopter_interval = setInterval(right_rocket, 20);

       setTimeout(()=>{
            document.getElementById('equation').innerHTML = '';

            start_game();

            calculate_score();
            console.log('score: ', score); 

            time = 10;
        }, 1500)

        setTimeout(()=> {
            feedback.innerHTML='';
        }, 2000)

    } else if (isNaN(user_ans) && time >= 0){
            para.innerText = 'Please enter a number. Time is ticking!'
            para.style.color = 'red';
            para.style.textAlign = 'center';
            feedback.appendChild(para);

            setTimeout(()=> {
                feedback.innerHTML='';
            }, 2000)         
    }
    else {
        para.innerText = 'Better luck next time! Moving to next question.';
        para.style.color = 'orange';
        para.style.textAlign = 'center';
        feedback.appendChild(para);
        console.log('worng');

        health--;
        hp.innerHTML = '';
        hp.innerText = health;
        

        clearInterval(timer);

        if (health <= 0) {
            game_over("You ran out of health!");
            return; // IMPORTANT: Stop further execution (like timeout for next question)
        }

        clearInterval(monster_interval);
        monster_interval = null;
        monster_interval = setInterval(left_rocket, 20);

        setTimeout(()=>{
            document.getElementById('equation').innerHTML = '';

            start_game();

            time = 10;    
        }, 1500)

        setTimeout(()=> {
            feedback.innerHTML='';
        }, 2000)
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_score(){
    //Variable
    score ++;
    //Gets the first p tag of score
    p = document.getElementById('score').getElementsByTagName('p')[0];

    p.innerHTML = score;

    score_stored();
}

//Add local storage logic here
function score_stored(){
    const stored = document.getElementById('stored_score');

    if (typeof(Storage) !== "undefined") {

        //Gets the current highest score if stored
        let saved_score = localStorage.getItem('highest');

        //Converts the stored score into a int type
        if (saved_score === null) {
            saved_score = 0;
        } else {
            saved_score = parseInt(saved_score);
        }

        //Stores and prints score
        if(score > saved_score){
            localStorage.setItem('highest', score);
            stored.innerHTML = score;
        }
    } else {
        stored.innerHTML = "Sorry, no Web storage support!";
    }
}

//Function to load the score
function load_score() {
    //Gets element
    const high_score = localStorage.getItem('highest');
    if (high_score !== null) {
        document.getElementById('stored_score').innerHTML = high_score;
    }
}

// Call load_high_score() function when game loads
load_score();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_time() {
    time --; 
    let time_div = document.getElementById('time');
    time_div.innerHTML = '';


    let container = document.createElement('div');

    let h1 = document.createElement('h1');
    h1.innerText = 'Time: ';
    
    let para = document.createElement("p");
    para.innerText = time;

    container.appendChild(h1)
    container.appendChild(para);
    container.style.textAlign = 'center';
    container.style.marginBottom = '1rem';

    time_div.append(container);

    if (time <= 0){
        clearInterval(timer);
        console.log('times up')

        // Show feedback
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = '';
        const para = document.createElement('p');
        para.innerText = 'Time\'s up! Moving to next question.';
        para.style.color = 'red';
        para.style.textAlign = 'center';
        feedback.appendChild(para);

        health--;
        hp.innerHTML = '';
        hp.innerText = health;

        clearInterval(monster_interval);
        monster_interval = null;
        monster_interval = setInterval(left_rocket, 20);

        if (health <= 0) {
            alert("You ran out of health!"); // Example game over call
            game_over();
            return; // Stop further execution if game is over
       }
        

        // Move to next question after delay
        setTimeout(() => {
            generate_num(max);
            operator = random_operator(operations);
            eq = form_equation(num1, num2, operator);

            let raw_answer = calculate_answer(num1, num2, operator);
            if (raw_answer === null) {
                answer = 'undefined';
            } else {
                answer = Math.floor(raw_answer);
            }

            document.getElementById('equation').innerHTML = '';
            time = 10;
            display_eq();
            display_initial_time();
            timer = setInterval(calculate_time, 1000);
            feedback.innerHTML = '';
        }, 2000);
    }
}


function display_initial_time(){
    let time_div = document.getElementById('time');
    time_div.innerHTML = '';

    let container = document.createElement('div');
    let h1 = document.createElement('h1');
    h1.innerText = 'Time: ';

    let para = document.createElement("p");
    para.innerText = time;

    container.appendChild(h1);
    container.appendChild(para);
    container.style.textAlign = 'center';
    container.style.marginBottom = '1rem'

    time_div.append(container);
}
//////////////////////////////////////////////////////////////////////
//Monster's Rocket
function left_rocket(){
    
    let left = document.getElementById('rocket_left');
    let left_style = window.getComputedStyle(left);
    let rocket_right = parseInt(left_style.getPropertyValue('right'));
    let left_width = monster.getBoundingClientRect().width;

    let game_width = document.getElementById('math_game').getBoundingClientRect().width;

    
    if (rocket_right + left_width <= game_width){
        left.style.right = (rocket_right + 5) + 'px';
        heli_collission();
    }
    else{
        left.style.right = '0px';
        clearInterval(monster_interval); // Stop THIS rocket's movement
        monster_interval = null;        
    }
}

//setInterval(left_rocket, 20);



//Helicopter's rocket
function right_rocket(){
    let right = document.getElementById('rocket_right');
    let rocket_style = window.getComputedStyle(right);
    let rocket_left = parseInt(rocket_style.getPropertyValue('left'));
    let rocket_width = right.getBoundingClientRect().width;

    let game_width = document.getElementById('math_game').getBoundingClientRect().width;

    if (rocket_width + rocket_left <= game_width){
        right.style.left = (rocket_left + 5) + 'px';
        rocket_collision();
    }
    else{
        right.style.left = '0px';
        clearInterval(helicopter_interval); // Stop THIS rocket's movement
        helicopter_interval = null;
    }
}

//setInterval(right_rocket, 20);



function rocket_collision() { 
    //Gets the positions 
    let heli_rocket_element = document.getElementById('rocket_right');
    let monster_element = document.getElementById('monster');

    let heli_rocket = heli_rocket_element.getBoundingClientRect();
    let mon = monster_element.getBoundingClientRect();


    //Checks if the carrot and obstacle overlap
    if (
        heli_rocket.left < mon.right &&
        heli_rocket.right > mon.left &&
        heli_rocket.top < mon.bottom &&
        heli_rocket.bottom > mon.top
    ) {
        clearInterval(helicopter_interval);
        helicopter_interval = null;
        //et helicopter = document.getElementById('helicopter');
        heli_rocket_element.style.left = '0px';
        alert('Collision Detected! Monster Hit!');

        monster_health --; 
        let monster_display = document.getElementById('monster_hp');
        monster_display.innerText = monster_health;

        if (monster_health <= 0){
            game_over('You defeated the monster!');
        }
        



    }
}

function heli_collission(){
    let monster_rocket_element = document.getElementById('rocket_left');
    let heli_element = document.getElementById('helicopter');

    let monster_rocket = monster_rocket_element.getBoundingClientRect();
    let heli = heli_element.getBoundingClientRect();

    if (
        monster_rocket.left < heli.right &&
        monster_rocket.right > heli.left &&
        monster_rocket.top < heli.bottom &&
        monster_rocket.bottom > heli.top
    ) {
        clearInterval(monster_interval);
        monster_interval = null;
        //let helicopter = document.getElementById('helicopter');
        monster_rocket_element.style.right = '0px';
        if (health <= 0) {
            game_over("Your helicopter was destroyed!");
            // The game_over function already stops all intervals.
        } else {
            // Optional: Give feedback without ending game
             alert('Ouch! Helicopter hit!'); // Simple feedback
             // You could add a visual effect like flashing the helicopter here
        }
    }
}


function game_over(){
    clearInterval(helicopter_interval);
    clearInterval(monster_interval);
    clearInterval(timer);

    timer = null; 
    helicopter_interval = null; 
    monster_interval = null; 
    alert('Game Over!');

    document.getElementById('equation').innerHTML = '';
    document.getElementById('time').innerHTML = '';
    document.getElementById('feedback').innerHTML = '';

    let heliRocket = document.getElementById('rocket_right');
    let monsterRocket = document.getElementById('rocket_left');
    if (heliRocket) heliRocket.style.left = '0px'; // Or starting position
    if (monsterRocket) monsterRocket.style.right = '0px'; // Or starting position

    score = 0; 
    health = 5; 
    time = 10; 

    document.getElementById('score').getElementsByTagName('p')[0].innerText = score;
    hp.innerText = health; // 'hp' already references the health paragraph

    let playAgainButton = document.getElementById('play-again-btn');
    if (playAgainButton) {
        playAgainButton.style.display = 'block'; // Make it visible
    }
     // Maybe hide the initial start button if it exists?
     let startButton = document.getElementById('start-game-button'); // Give your start button an ID
     if (startButton) {
         startButton.style.display = 'none';
     }

      // 7. Prepare for restart
    let playAgainBtn = document.getElementById('play-again-btn'); // Use local var
    if (playAgainBtn) {
        playAgainBtn.style.display = 'block'; // Show the button
    }
     let startBtn = document.getElementById('start-game-button'); // Use local var
     if (startBtn) {
         startBtn.style.display = 'none'; // Keep initial start hidden
     }
}


const startButton = document.getElementById('start-game-button');
const playAgainButton = document.getElementById('play-again-btn');

// Function for the INITIAL start button click
function initial_start_game() {
    startButton.style.display = 'none'; // Hide initial start button
    playAgainButton.style.display = 'none'; // Ensure play again is hidden
    // Reset state JUST IN CASE before first game (optional but safe)
    score = 0;
    health = 5;
    time = 10;
    document.getElementById('score').getElementsByTagName('p')[0].innerText = score;
    hp.innerText = health;

    let monster_display = document.getElementById('monster_hp');
    monster_display.innerText = monster_health;

    document.getElementById('equation').innerHTML = '';
    document.getElementById('time').innerHTML = '';
    document.getElementById('feedback').innerHTML = '';

    // Reset rocket positions visually (optional but good practice)
    let heliRocket = document.getElementById('rocket_right');
    let monsterRocket = document.getElementById('rocket_left');
    if (heliRocket) heliRocket.style.left = '0px';
    if (monsterRocket) monsterRocket.style.right = '0px';

    // Call the actual game logic start
    start_game();
}


// Add event listener for the "Play Again" button

playAgainButton.addEventListener('click', () => {
    console.log("Play Again clicked");
    playAgainButton.style.display = 'none'; // Hide itself
    // Ensure game state is reset (game_over should have done this, but belt-and-suspenders)
    score = 0;
    health = 5;
    monster_health = 2; //chnage this to 10
    time = 10;
    document.getElementById('score').getElementsByTagName('p')[0].innerText = score;
    hp.innerText = health;

    
    let monster_display = document.getElementById('monster_hp');
    monster_display.innerText = monster_health;

    load_score(); // Reload high score display

    // Start a new game sequence
    start_game();
});
//Variables
let max = 100; 
let score = 0;
let time = 10; 
let health = 5;
let eq, answer, num1, num2, operator, timer; 
const operations = ['+', '-', '*', '/'];
let hp = document.getElementById('my_health');
let helicopter_interval = null; 
let monster_interval = null;
let monster_health = 2; //CHANGE THIS TO 5 AFTER RECORDING
let is_gameover = false; 



//The popup works with enter
function check_enter(event) {
    //Checks if the key pressed is enter
    if (event.key === 'Enter') {
        //Hides popup 
        hide_popup();
        //Removes the event listner that calls this
        document.removeEventListener('keydown', check_enter); 
    }
}
//Adds event listner if a key is pressed to call the check_enter function
document.addEventListener('keydown', check_enter);



//Hides the popup
function hide_popup(){

    //Gets the value the user inputted
    max = parseInt(document.getElementById('max_num').value);
    console.log('User max:' , max);

    //Checks if it is a number and if it is less that 1
    if (isNaN(max) || max < 1){
        //Prompts the user to input a valid number
        document.getElementsByTagName('p')[0].innerHTML = "Please enter a valid number";
    }
    else {
        //Hides the popup and shows the game 
        document.getElementById('popup').style.display = 'none';
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
    }    
}



//Creates the equation, timer, and answer
function start_game(){
    //Generates the 2 numbers
    generate_num(max);

    //Gets a random operator
    operator = random_operator(operations);

    //Puts the equation together
    eq = form_equation(num1,num2,operator);
    console.log('Equation:', eq);

    //Calculates the actual answer inlucing /0
    let raw_answer = calculate_answer(num1, num2, operator);

    //Checks if a division by zero occured
    if (raw_answer === null) {
        answer = 'undefined';
    } else {
        //rounds off to the nearest whole number
        answer = Math.floor(raw_answer);
    }
    console.log(answer);

    //Displays equation 
    display_eq(); 

    //Creates tags for the time to show on screen
    display_initial_time();

    //Sets timer to an interval
    timer = setInterval(calculate_time, 1000)

}



//Generates the numbers
function generate_num(num){
    //Generates the fist number
    num1 = Math.floor(Math.random() * num);
    console.log('Number 1: ', num1);
    
    //Generates the second number
    num2 = Math.floor(Math.random()* num);
    console.log('Number 2: ', num2);  
}



//Genreates the operator
function random_operator(operator_array){
    //Generates a number form the array length
    random = Math.floor(Math.random() * operator_array.length);

    //Sellects the operator
    operator = operator_array[random];
    console.log('Operator: ', operator);
    return operator;
}



//Formulates Equation
function form_equation(num1, num2, operator){
    //Concatenates the numbers and operator
    equation = num1 + ' ' + operator + ' ' + num2;
    return equation
}



//Calculates the answer 
function calculate_answer(num1, num2, operator) {
    //Checks which operator was generated
    switch (operator) {
        //Adds
        case '+':
            return num1 + num2;
        //Subtracts
        case '-':
            return num1 - num2;
        //Multiplies
        case '*':
            return num1 * num2;
        //Divides
        case '/':
            //Checks if a number is being divided by zero
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



//Displays equation
function display_eq(){
    //Creates a container
    let container = document.createElement('div');

    //Creates a h3 tag
    let h3 = document.createElement('h3');
    //Mkaes the h3 tag have the following text
    h3.innerText = 'Please solve the following:';
    
    //Creates a p tag
    let para = document.createElement("p");
    //Makes the p tag contain the equation
    para.innerText = eq + ' ' +  '=';

    //Creates an input
    let input = document.createElement('input');
    //Give it an id
    input.id = 'user_ans';
    //Specifies the type
    input.type = 'text';
    //Adds styling
    input.style.marginLeft = '10px';
    //Placeholder
    input.placeholder = 'enter answer here';

    //Creates a button 
    let btn = document.createElement('button');
    //Button text
    btn.innerText = "Submit";
    //When pressed it checks answer
    btn.onclick = function () {
        check_ans(answer);
    };

    //Everything is appended to the container 
    container.appendChild(h3)
    container.appendChild(para);
    container.appendChild(input);
    container.appendChild(btn);
    //They are centered 
    container.style.textAlign = 'center';

    //Appends the container to the equation section
    document.getElementById('equation').appendChild(container);
}



//Checks user answer
function check_ans(correct_answer){
    //Gets the user's answer
    user_ans = parseFloat(document.getElementById('user_ans').value);
    console.log('User answer: ', user_ans);

    //Gets element id
    let feedback = document.getElementById('feedback'); 
    //Creates a p tag
    let para = document.createElement('p');
    
    //Checks if answer is correct and if the user still has time
    if (correct_answer === user_ans && time >= 0){
        console.log('correct');

        //P tag contents 
        para.innerText = 'Good Job! Moving to next question.';
        //p tag styling 
        para.style.color = 'green';
        para.style.textAlign = 'center';
        //p tag is appended to feedback 
        feedback.appendChild(para);

        //Stops the timer 
        clearInterval(timer);

        //Stops helicopter rocket 
        clearInterval(helicopter_interval);
        helicopter_interval = null;
        
        //Moves helicopter rocket       
        helicopter_interval = setInterval(right_rocket, 20);

        //Delays the equation generation
        setTimeout(()=>{
            //Stops if game over is true
            if (is_gameover) return;
            //Clears previous equation
            document.getElementById('equation').innerHTML = '';

            //Generates equation
            start_game();

            //Calculates score
            calculate_score();
            console.log('score: ', score); 

            //Sets time to 10
            time = 10;
        }, 1500)

        //Delays clearing feedback
        setTimeout(()=> {
            feedback.innerHTML='';
        }, 2000)

    } 
    //If the users enetrs a non number value
    else if (isNaN(user_ans) && time >= 0){
            //Feedback text
            para.innerText = 'Please enter a number. Time is ticking!'
            para.style.color = 'red';
            para.style.textAlign = 'center';
            feedback.appendChild(para);

            //Delays clearing feedback
            setTimeout(()=> {
                feedback.innerHTML='';
            }, 2000)         
    }
    //If answer is worng
    else {
        //Feedback text
        para.innerText = 'Better luck next time! Moving to next question.';
        para.style.color = 'orange';
        para.style.textAlign = 'center';
        feedback.appendChild(para);
        console.log('worng');
        
        //Stops timer
        clearInterval(timer);

        //Changes the monster picture to one with a rocket
        let new_pic = document.getElementById('monster');
        new_pic.style.backgroundImage = 'url(../img/monster_rocket.png)';

        //Stops monster's rocket
        clearInterval(monster_interval);
        monster_interval = null;
        //Moves monsters rocket
        monster_interval = setInterval(left_rocket, 20);
        
        //Delays equation generation 
        setTimeout(()=>{
            //Stops if game over is true
            if (is_gameover) return;
            //Clears previous equation 
            document.getElementById('equation').innerHTML = '';

            //Sets back the monster to its original form             
            new_pic.style.backgroundImage = 'url(../img/monster.png)';

            //Generates equation
            start_game();

            //sets time to zero
            time = 10;    
        }, 1500)

        //Delays clearing feedback
        setTimeout(()=> {
            feedback.innerHTML='';
        }, 2000)
    }
}



//Claculates score
function calculate_score(){
    //Increases score
    score ++;

    //Gets the first p tag of score
    p = document.getElementById('score').getElementsByTagName('p')[0];
    //sets the p tag to the score count 
    p.innerHTML = score;

    //Stores the score
    score_stored();
}



//Stores score 
function score_stored(){
    //Gets id
    const stored = document.getElementById('stored_score');

    //Checks is local storage is supported and stores the score
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
            //Saves score
            localStorage.setItem('highest', score);
            //Prints score
            stored.innerHTML = score;
        }
    } else {
        stored.innerHTML = "Sorry, no Web storage support!";
    }
}

//Function to load the score
function load_score() {
    //Gets stored score
    const high_score = localStorage.getItem('highest');

    //Prints score
    if (high_score !== null) {
        document.getElementById('stored_score').innerHTML = high_score;
    }
}

//Call load_high_score() function when game loads
load_score();



//Decrements timer
function calculate_time() {
    //Decrements time
    time --; 

    //Gets id 
    let time_div = document.getElementById('time');
    //Clears previous time 
    time_div.innerHTML = '';

    //Creates div
    let container = document.createElement('div');

    //Creates h3 with text
    let h3 = document.createElement('h3');
    h3.innerText = 'Time: ';
    
    //Creates p with the time
    let para = document.createElement("p");
    para.innerText = time;

    //Appends everthing to the container and adds style
    container.appendChild(h3)
    container.appendChild(para);
    container.style.textAlign = 'center';
    container.style.marginBottom = '1rem';

    //Appends container to the div
    time_div.append(container);

    //Checks if user does not have time
    if (time <= 0){
        //Gets element id
        let feedback = document.getElementById('feedback'); 
        //Creates a p tag
        let para = document.createElement('p');

        //Feedback text
        para.innerText = 'Time is up! Moving to next question.';
        para.style.color = 'orange';
        para.style.textAlign = 'center';
        feedback.appendChild(para);
        console.log('worng');
        
        //Stops timer
        clearInterval(timer);

        //Changes the monster picture to one with a rocket
        let new_pic = document.getElementById('monster');
        new_pic.style.backgroundImage = 'url(../img/monster_rocket.png)';

        //Stops monster's rocket
        clearInterval(monster_interval);
        monster_interval = null;
        //Moves monsters rocket
        monster_interval = setInterval(left_rocket, 20);
        
        //Delays equation generation 
        setTimeout(()=>{
            //Stops if game over is true
            if (is_gameover) return;
            //Clears previous equation 
            document.getElementById('equation').innerHTML = '';

            //Sets back the monster to its original form             
            new_pic.style.backgroundImage = 'url(../img/monster.png)';

            //Generates equation
            start_game();

            //sets time to zero
            time = 10;    
        }, 1500)

        //Delays clearing feedback
        setTimeout(()=> {
            feedback.innerHTML='';
        }, 2000)
    }
}

//Print time
function display_initial_time(){
    //Gets div
    let time_div = document.getElementById('time');
    //Clears previous time 
    time_div.innerHTML = '';

    //Creates div
    let container = document.createElement('div');
    //Creates h3 tag
    let h3 = document.createElement('h3');
    //Adds text
    h3.innerText = 'Time: ';

    //Creates p 
    let para = document.createElement("p");
    //Sets p to the time 
    para.innerText = time;

    //Appends everything to the div 
    container.appendChild(h3);
    container.appendChild(para);
    //Adds styling 
    container.style.textAlign = 'center';
    container.style.marginBottom = '1rem'

    //Appends div to time
    time_div.append(container);
}



//Monster's Rocket
function left_rocket(){
    //Gets respective dimentions
    let left = document.getElementById('rocket_left');
    let left_style = window.getComputedStyle(left);
    let rocket_right = parseInt(left_style.getPropertyValue('right'));
    let left_width = monster.getBoundingClientRect().width;
    let game_width = document.getElementById('math_game').getBoundingClientRect().width;
    //Make rocket visible
    left.style.visibility = 'visible';

    //Checks if the rockect reached the right
    if (rocket_right + left_width <= game_width){
        //Moves rocket
        left.style.right = (rocket_right + 5) + 'px';
        //Checks for collision
        heli_collission();
    }
    else{
        //Rests rocket to original position
        left.style.right = '-35px';
        //Stops rocket
        clearInterval(monster_interval);
        monster_interval = null;
        //Hides rocket        
        left.style.visibility = 'hidden';
    }
}

//Helicopter's rocket
function right_rocket(){
    //Gets respective dimentions
    let right = document.getElementById('rocket_right');
    let rocket_style = window.getComputedStyle(right);
    let rocket_left = parseInt(rocket_style.getPropertyValue('left'));
    let rocket_width = right.getBoundingClientRect().width;
    let game_width = document.getElementById('math_game').getBoundingClientRect().width;
    //Shows rocket
    right.style.visibility = 'visible';

    //Checks if rocket reached the left
    if (rocket_width + rocket_left <= game_width){
        //Moves rocket
        right.style.left = (rocket_left + 5) + 'px';
        //Checks for collision
        rocket_collision();
    }
    else{
        //Rests rocket to original position
        right.style.left = '-30px';
        //Stops rocket
        clearInterval(helicopter_interval);
        helicopter_interval = null;
    }
}



//Checks collision
function rocket_collision() { 
    //Gets the ids 
    let heli_rocket_element = document.getElementById('rocket_right');
    let monster_element = document.getElementById('monster');

    //Gets the positions
    let heli_rocket = heli_rocket_element.getBoundingClientRect();
    let mon = monster_element.getBoundingClientRect();


    //Checks for overlap
    if (heli_rocket.left < mon.right && heli_rocket.right > mon.left && heli_rocket.top < mon.bottom && heli_rocket.bottom > mon.top) {
        //Stops rocket
        clearInterval(helicopter_interval);
        helicopter_interval = null;
        
        //Rests rocket position
        heli_rocket_element.style.left = '-30px';
        alert('Collision Detected! Monster Hit!');

        //Reduces monsters health
        monster_health --; 
        //Gets id
        let monster_display = document.getElementById('monster_hp');
        //Updates health
        monster_display.innerText = monster_health;

        //Hides rocket
        heli_rocket_element.style.visibility = 'hidden'

        //Check is monster still has health
        if (monster_health <= 0){
            game_over('You defeated the monster!');
        }
    }
}

//Checks for collisions
function heli_collission(){
    //Gets ids
    let monster_rocket_element = document.getElementById('rocket_left');
    let heli_element = document.getElementById('helicopter');

    //Gets the positions
    let monster_rocket = monster_rocket_element.getBoundingClientRect();
    let heli = heli_element.getBoundingClientRect();

    //Checks for overlap
    if (monster_rocket.left < heli.right && monster_rocket.right > heli.left && monster_rocket.top < heli.bottom && monster_rocket.bottom > heli.top) {
        //Stops rocket
        clearInterval(monster_interval);
        monster_interval = null;

        alert('Ouch! Helicopter hit!');
        //Reduces user health and updates it
        health--;
        hp.innerHTML = '';
        hp.innerText = health;
        
        //Resets rocket position
        monster_rocket_element.style.right = '-35px';

        //Hides rocket
        monster_rocket_element.style.visibility = 'hidden';

        //CHekcs if the user still has health
        if (health <= 0) {
            game_over("Your helicopter was destroyed!");
        }
    }
}




//Stops game
function game_over(){
    //sets game over to true
    is_gameover = true;
    //Stops all intervals
    clearInterval(helicopter_interval);
    clearInterval(monster_interval);
    clearInterval(timer);

    //Resets these variables
    timer = null; 
    helicopter_interval = null; 
    monster_interval = null; 
    alert('Game Over!');

    //Clears these sections
    document.getElementById('equation').innerHTML = '';
    document.getElementById('time').innerHTML = '';
    document.getElementById('feedback').innerHTML = '';


    //Resets rocket to original positions
    let heli_Rocket = document.getElementById('rocket_right');
    let monster_Rocket = document.getElementById('rocket_left');
    heli_Rocket.style.left = '-30px'; 
    monster_Rocket.style.right = '-35px'; 

    //Updates variables to original values
    score = 0; 
    health = 5; 
    time = 10; 

    //Updates 
    document.getElementById('score').getElementsByTagName('p')[0].innerText = score;
    hp.innerText = health;

    //Play again button is visible
    let play_again = document.getElementById('play_again');
    play_again.style.display = 'block';
    
    //Hides play button
    let startButton = document.getElementById('start_game'); 
    startButton.style.display = 'none';
}

//Variables
const start_button_btn = document.getElementById('start_game');
const play_again_btn = document.getElementById('play_again');

//Function for the initial start button click
function initial_start_game() {
    //Make game over false
    is_gameover = false;
    //hides buttons
    start_button_btn.style.display = 'none';
    play_again_btn.style.display = 'none';

    //Resets the statses
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


    let heli_Rocket = document.getElementById('rocket_right');
    let monster_Rocket = document.getElementById('rocket_left');
    heli_Rocket.style.left = '-30px';
    monster_Rocket.style.right = '-35px';

    //Calls the actual game logic start
    start_game();
}

//Function to play again
function play_again(){
    console.log("Play Again clicked");
    //Makes game over false 
    is_gameover = false;
    //Hide
    play_again_btn.style.display = 'none';
    // Rests
    score = 0;
    health = 5;
    monster_health = 2; //CHANGE THIS TO 5 AFTER RECORDING
    time = 10;
    document.getElementById('score').getElementsByTagName('p')[0].innerText = score;
    hp.innerText = health;

    
    let monster_display = document.getElementById('monster_hp');
    monster_display.innerText = monster_health;

    //Reload high score display
    load_score(); 

    //Start a new game
    start_game();
}
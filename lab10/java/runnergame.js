
//Moves Obstacle
obstacle = document.getElementById('obstacle');

function move_obstacle(){
    styles = window.getComputedStyle(obstacle);
    obstacle_pos = parseInt(styles.getPropertyValue('left'));

    if (obstacle_pos > 0){
        obstacle.style.left = (obstacle_pos - 5) + 'px';
    }
    else{
        obstacle.style.left = '480px';
    }   
}

setInterval(move_obstacle, 30);

//Make the runner jump 
let runner = document.getElementById('runner');
let jumping = false;

document.addEventListener('keypress', chk_jump);
document.addEventListener('touchstart', jump);

function chk_jump(){
    if (!jumping){
        jump();
    }
}

function jump(){
    let highest_jump = 80;
    jumping = true; 

    let riseing = setInterval(goingup, 30);

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
        let desending = setInterval(goingdown, 30);

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


function chek_collision(){ 
    current_runner_pos = parseInt(window.getComputedStyle(runner).getPropertyValue('top'));
    current_obstacle_pos = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    if ((current_runner_pos === 150 || current_runner_pos === 130) && current_obstacle_pos >= 40 && current_obstacle_pos <= 60){
        alert('Collision Detected');
        obstacle.style.left = '480px'
    }
}
setInterval(chek_collision, 30)
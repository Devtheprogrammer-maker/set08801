//Variables
let max = 100;
let eq, answer, num1, num2, operator; 
const operations = ['+', '-', '*', '/'];


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
        document.getElementById('math_game').style.display = 'block';

        generate_num(max);

        operator = random_operator(operations);

        eq = form_equation(num1,num2,operator);
        console.log(eq);

        answer = Math.floor(calculate_answer(num1, num2, operator));
        console.log("Answer:", answer);

        display_eq();   
    }    
}


//Generates Numbers
function generate_num(num){

    num1 = Math.floor(Math.random() * num);
    console.log(num1);
    
    num2 = Math.floor(Math.random()* num);
    console.log(num2);  
}

//Genreates Random Operator
function random_operator(operator_array){

    random = Math.floor(Math.random() * operator_array.length);

    operator = operator_array[random];
    console.log(operator);
    return operator;
}

//Formulates Equation
function form_equation(num1, num2, operator){

    equation = num1 + ' ' + operator + ' ' + num2;
    return equation
}

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
                ans = 'undefined';
            }else{
                ans = num1 / num2;
            }
            return ans; 
        default:
            return null;
    }
}

// Display equation
function display_eq(){

    let container = document.createElement('div');
    
    let para = document.createElement("p");
    para.innerText = eq + ' ' +  '=';

    let input = document.createElement('input');
    input.id = 'user_ans';
    input.type = 'text';
    input.style.marginLeft = '10px';

    let btn = document.createElement('button');
    btn.innerText = "Submit";
    btn.onclick = function () {
        chk_ans(answer);
    };

    container.appendChild(para);
    container.appendChild(input);
    container.appendChild(btn);

    document.getElementById('math_game').appendChild(container);
}

function chk_ans(correct_answer){

    user_ans = parseFloat(document.getElementById('user_ans').value);

    if (correct_answer === user_ans){

        console.log('correct');
        generate_num(max);

        operator = random_operator(operations);

        eq = form_equation(num1,num2,operator);
        console.log(eq);

        answer = Math.floor(calculate_answer(num1, num2, operator));
        console.log("Answer:", answer);

        document.getElementById('math_game').innerHTML = '';

        display_eq();
    }else {

        console.log('worng');
    }

}
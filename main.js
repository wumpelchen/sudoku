let matrix;
let matrixSolvedGrid;
let fieldPossibilities;
let focusOn;


//let matrixSolvedGrid = sudoku.board_string_to_grid(matrixSolved);

function generateGrid(diff = ''){

    //console.log(`Set diffilcult to ${diff}`)

    matrix              = sudoku.generate('easy', false);
    let matrixSolved    = sudoku.solve(matrix);
    matrixSolvedGrid    = sudoku.board_string_to_grid(matrixSolved);
    fieldPossibilities  = sudoku.get_candidates(matrix);
    let matrixGrid      = sudoku.board_string_to_grid(matrix);
    let newMatrix       = sudoku.board_string_to_grid(matrixSolved);

    let numOfRemoveDigets;

    switch (diff) {
        case ('easy'):
            numOfRemoveDigets = 2;
            break;
        case ('medium'):
            numOfRemoveDigets = 3;
            break;
        case ('hard'):
            numOfRemoveDigets = 4;
            break;
        case ('very-hard'):
            numOfRemoveDigets = 5;
            break;
        case ('insane'):
            numOfRemoveDigets = 6;
            break;
        case ('inhuman'):
            numOfRemoveDigets = 7;
            break;
    }

    for(let row in newMatrix){

        for(let j=0; j <numOfRemoveDigets; j++){

            let col;
            let nextCol = true;
            
            while (nextCol){
                col  = Math.floor(Math.random()*9);
                if(newMatrix[row][col] != '.'){
                    nextCol = false;
                    newMatrix[row][col] = '.'
                }
            }
        }

    }

    // console.log('matrix solved')
    // sudoku.print_board(matrixSolved);
    // console.log('----------------------------------------------------')
    // console.log('matrix solvedGrid')
    // sudoku.print_board(sudoku.board_grid_to_string(matrixSolvedGrid))
    // console.log('----------------------------------------------------')
    // console.log('newMatrix')
    // sudoku.print_board(sudoku.board_grid_to_string(newMatrix))

    const rows = [];
    
    for(let r= 0; r < 9 ; r++){
        let row = document.querySelectorAll(`[data-row="${r}"]`);
        rows.push(row);
    }
    
    
    for(let i in newMatrix){
        let cells = rows[i]
        for(let j in newMatrix[i]){

            cells[j].setAttribute('readonly', 'true');

            if(newMatrix[i][j] != '.') {
                cells[j].dataset.canEdit = 'false';
                cells[j].classList.add('readOnly');
            }else{
                cells[j].dataset.canEdit = 'true';
                cells[j].classList.remove('readOnly');
            }
            cells[j].value = newMatrix[i][j].replace('.', '');
        }
    }
}


//==========================================================================================

const btnNeu = document.querySelector('.btnNeu');

btnNeu.addEventListener('click', ()=>{
    showHideNumBox('hide');
    generateGrid(document.getElementById('selectDiff').value);
    
    allInputs.forEach(elem=>elem.classList.remove('wrong'));
    
    sec = 0;
    min = 0;
    std = 0;
    stopTimer = false;
})

//==========================================================================================

const allInputs = document.querySelectorAll('input');

allInputs.forEach(elem => elem.addEventListener('focus', (e)=>{
    
    focusOn = elem;
    
    //console.log(elem.dataset)
    
    allInputs.forEach(input=>input.classList.remove('highlightLine'))
    
    allInputs.forEach(input =>{
        if(input.dataset.col == elem.dataset.col) input.classList.add('highlightLine');
        if(input.dataset.row == elem.dataset.row) input.classList.add('highlightLine');   
    })
    
    if(elem.dataset.canEdit == 'true') {
        showHideNumBox('show', elem.getBoundingClientRect());
    }
    else showHideNumBox('hide');
    
    //console.log(fieldPossibilities[elem.dataset.row][elem.dataset.cell]);
}))

//==========================================================================================

const btnReady = document.querySelector('.btnReady');

btnReady.addEventListener('click', ()=>{
    let rows = [];
    let isReady = true;
    let hasMistakes = false;
    
    for(let r= 0; r < 9 ; r++){
        let row = document.querySelectorAll(`[data-row="${r}"]`);
        rows.push(row);
    }
    
    
    for(let i in matrixSolvedGrid){
        
        let cells = rows[i]
        
        for(let j in matrixSolvedGrid[i]){
            cells[j].classList.remove('wrong')
            
            if(matrixSolvedGrid[i][j] != cells[j].value){
                
                cells[j].classList.add('wrong');
                hasMistakes = true;
            }
        }
        
    }
    
    if(hasMistakes) alert('Sorry das war nicht ganz richtig!');
    if(!hasMistakes) {
        stopTimer = true;
        let timeStamp = document.querySelector('.timer').innerText;
        alert(`SUPER, Du hast es in ${timeStamp} geschafft!`);
    }
})


//======================================================================================================

const btnHelp = document.querySelector('.btnHelp');

btnHelp.addEventListener('click', ()=>{
    alert(`Folgendes wäre hier möglich! ${fieldPossibilities[focusOn.dataset.row][focusOn.dataset.cell]}`);
})

//=====================================================================================================

const numBox = document.querySelector('.num_box');
const numBlock = numBox.querySelectorAll('.numBtn');

numBlock.forEach(btn=>btn.addEventListener('click', ()=>{
    focusOn.value = btn.id;
    showHideNumBox('hide');

    //check if game is lost or ready
    let canCheck = true;

    let len = allInputs.length;

    for(let i = 0; i < len; i++){
        if(allInputs[i].value.length == 0){
            canCheck = false;
            break;
        }
    }
    
    if(canCheck) btnReady.click();

}))

//====================================================================================================


const btnCloseNumBox = document.querySelector('.btnClose');

btnCloseNumBox.addEventListener('click', ()=>showHideNumBox('hide'));


//====================================================================================================

function showHideNumBox(showOrHide, pos){
    
    if(showOrHide == 'hide' && !numBox.classList.contains('hide')) numBox.classList.add('hide');
    if(showOrHide == 'show') {
        
        if(numBox.classList.contains('hide')) numBox.classList.remove('hide');
        
        if(pos != undefined){
            numBox.style.top  = pos.y + 54 + 'px';
            numBox.style.left = pos.x + 54 + 'px';
        }
        
    }
}

//=====================================================================================================

let sec = 0;
let min = 0;
let std = 0;
let stopTimer = false;

function startTimer(){
    setInterval(()=>{
        if(!stopTimer){
            sec++;
            
            if(sec == 60){
                sec = 0;
                min++;
            }
            
            if(min == 60){
                min = 0;
                std++;
            }
            
            let strSec = '';
            let strMin = '';
            let strStd = '';
            
            (sec < 10)?strSec = `0${sec}` : strSec = sec;
            (min < 10)?strMin = `0${min}` : strMin = min;
            (std < 10)?strStd = `0${std}` : strStd = std;
            
            document.querySelector('.timer').innerText = `${strStd}:${strMin}:${strSec}`;
        }
    },1000)
}

//=====================================================================================================

generateGrid('medium');
startTimer();

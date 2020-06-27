let matrix;
let matrixSolvedGrid;
let fieldPossibilities;
let focusOn;


//let matrixSolvedGrid = sudoku.board_string_to_grid(matrixSolved);

function generateGrid(diff = ''){

    //console.log(`Set diffilcult to ${diff}`)

    matrix = sudoku.generate(diff, false);
    let matrixSolved = sudoku.solve(matrix);
    matrixSolvedGrid = sudoku.board_string_to_grid(matrixSolved);
    fieldPossibilities = sudoku.get_candidates(matrix);
    let matrixGrid   = sudoku.board_string_to_grid(matrix);

    //sudoku.print_board(matrix);

    const rows = [];
    
    for(let r= 0; r < 9 ; r++){
        let row = document.querySelectorAll(`[data-row="${r}"]`);
        rows.push(row);
    }
    
    
    for(let i in matrixGrid){
        let cells = rows[i]
        for(let j in matrixGrid[i]){

            cells[j].setAttribute('readonly', 'true');

            if(matrixGrid[i][j] != '.') {
                cells[j].dataset.canEdit = 'false';
                cells[j].classList.add('readOnly');
            }else{
                cells[j].dataset.canEdit = 'true';
                cells[j].classList.remove('readOnly');
            }
            cells[j].value = matrixGrid[i][j].replace('.', '');
        }
    }
}

generateGrid('easy')


const btnNeu = document.querySelector('.btnNeu');

btnNeu.addEventListener('click', ()=>{
    generateGrid(document.getElementById('selectDiff').value);
})

const allInputs = document.querySelectorAll('input');

allInputs.forEach(elem => elem.addEventListener('focus', (e)=>{

    focusOn = elem;

    if(elem.dataset.canEdit == 'true') {
        showHideNumBox('show', elem.getBoundingClientRect())
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
    if(!hasMistakes) alert('SUPER');
})


//======================================================================================================

const btnHelp = document.querySelector('.btnHelp');

btnHelp.addEventListener('click', ()=>{
    alert(`Folgendes wäre hier möglich! ${fieldPossibilities[focusOn.dataset.row][focusOn.dataset.cell]}`);
})

const numBox = document.querySelector('.num_box');
const numBlock = numBox.querySelectorAll('.numBtn');

numBlock.forEach(btn=>btn.addEventListener('click', ()=>{
    focusOn.value = btn.id;
    showHideNumBox('hide')
}))

//====================================================================================================


const btnCloseNumBox = document.querySelector('.btnClose');

btnCloseNumBox.addEventListener('click', ()=>showHideNumBox('hide'))


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


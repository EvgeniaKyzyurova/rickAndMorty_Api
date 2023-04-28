const root = document.getElementById('root');
const box = document.getElementById('characters-wrap');
async function getCharacter(id){
    return await fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then(response => {
        if (response.ok){
            return response.json();
        }else{
            alert('Character not found');
            return null;
        }
        
    })
}
function drawCharacter(data){
    const character = document.createElement('div');
    character.id = data.id;
    character.className = 'box';
    character.innerHTML = character.innerHTML + 
    `<img src ='${data.image}'>
    <div class="name">${data.name}</div>
    <button id='${data.id}' class="btn">Delete</button>`
    
    box.append(character);
}
let itemsArr = [localStorage.getItem(`characters`)];
function search(){
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click',() => {
        const searchInput = document.getElementById('search-input').value.trim();
        if(searchInput !== ''){
            getCharacter(searchInput)
            .then((data) => {
                if(data){
                    if(localStorage.getItem(`characters`)){
                        if(localStorage.getItem(`characters`).split(',').includes(String(data.id))){
                            alert(`Character ${data.id} is already in the list`);
                            return null;
                        }
                    }
                    drawCharacter(data);
                    itemsArr.unshift(data.id);
                    localStorage.setItem(`characters`,itemsArr);
                    deleteCard();
                }
                
            })
        }else{
            alert('Invalid input data')
        }
        
    })
}
let i = 0;
let limit = 5;
function renderCard(items){
    let itemList = items.split(',')
    if(itemList[itemList.length-1]===''){
        itemList.pop();
    }
    const idArr = itemList.slice(i, Math.min(itemList.length, limit));
    for(let i = 0; i < idArr.length; i++){
        getCharacter(idArr[i])
        .then((data) => {
            if(data){
                drawCharacter(data);
                deleteCard();
                
            }
        })
    }
    load(idArr, items);
}
function load(idArr,items){
    const loadBtn = document.querySelector('.load-more');
    loadBtn.addEventListener('click',() => {
        const five = 5;
        limit += five;
        i += idArr.length;
        renderCard(items);
    })
}
function deleteCard(){
    const deleteBtnArr= document.querySelectorAll('.btn');
    for(let btn of deleteBtnArr){
        btn.addEventListener('click',() => {
            let iteM = localStorage.getItem('characters').split(',');
            iteM = iteM.filter((el) => {
                return el!==String(btn.id);
            })
            localStorage.setItem('characters', iteM.join());
            const cardToDelete = document.getElementById(`${btn.id}`);
            if(cardToDelete){
                cardToDelete.remove();
            }
             
        })
    }
    
}
function game(){
    //localStorage.clear();
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    const items = localStorage.getItem(`characters`);
    if (items){
        renderCard(items);
    }
    search();
    
}
game();


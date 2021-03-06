//資料
let todoCategorys = [
    {
        name:"重要且緊急",
        todos:["急事3","急事4","急事5","急事6","急事7"],
        dones:["急事1","急事2"]
    },
    {
        name:"重要但不緊急",
        todos:["要事1","要事2","要事3"],
        dones:[]
    },
    {
        name:"不重要但緊急",
        todos:["煩事1","煩事2","煩事3","煩事4"],
        dones:["煩事5"]
    },
    {
        name:"不重要也不緊急",
        todos:["閒事1","閒事2","閒事3","閒事4","閒事5"],
        dones:[]
    }
]

//設定變數
const dropdownMenu = document.querySelector("#category")
const newTodoinput = document.querySelector('#newTodo')
const addBtn = document.querySelector('#addBtn')

const newTodoSearchs = document.querySelectorAll("#inputTodoContent .input-group")
const newTodoUls = document.querySelectorAll("#inputTodoContent ul")

const doneSearchs = document.querySelectorAll("#doneTodoContent .input-group")
const doneTodoUls = document.querySelectorAll('#doneTodoContent ul')

let target
let category

//設定監聽器
dropdownMenu.addEventListener('click' , function(event){
    target = event.target
    const dropdownButton = this.parentElement.children[0]
    dropdownButton.innerHTML = target.innerHTML
    category = dropdownButton.innerHTML
})

addBtn.addEventListener('click' , inputTodo)
newTodoinput.addEventListener('keypress' , inputKeypress)

newTodoSearchs.forEach(searchgroup =>{
    searchgroup.addEventListener('click',search)
    searchgroup.addEventListener('keypress' , inputKeypress)
    searchgroup.addEventListener('click',redo)
})

newTodoUls.forEach(ul =>{
    ul.addEventListener('click',deleteAndCheck)
})

doneSearchs.forEach(searchgroup =>{
    searchgroup.addEventListener('click',search)
    searchgroup.addEventListener('keypress' , inputKeypress)
    searchgroup.addEventListener('click',redo)
})


//設定function
/**以template literal將物件陣列原有資料寫入ul
 */
todoCategorys.forEach(todoCategory =>{   
    category = todoCategory.name
    todoCategory.todos.forEach(todo => {
        addItem(todo)
    })
    todoCategory.dones.forEach(done =>{
        addDone(done)
    })
    category = null
})

/**建立li後append至對應的新增代辦事項ul
 * 1. 建立li
 * 2. 將該li新增至對應的事件分類ul
 * @param {*} text li要呈現的文字
 */
function addItem (text) {
    const newItem = document.createElement('li')
    newItem.classList.toggle('list-group-item')
    newItem.innerHTML = `
      <label for="todo">${text}</label>
      <i class="delete fa fa-trash"></i>`
    addCategory(newItem)
}

/**建立li後append至對應的已完成代辦事項ul
 * 1. 建立li
 * 2. 將該li新增至對應的事件分類ul
 * @param {*} text li要呈現的文字
 */
function addDone(text) {
    const doneItem = document.createElement('li')
    doneItem.classList.toggle('list-group-item')
    doneItem.innerHTML = `
        <label for="todo" class="checked">${text}</label>
        <i class="fa fa-check-square" aria-hidden="true"></i>` 
    addCategory(doneItem)
}

/**將li新增至對應的事件分類ul
 * 以該li的icon判斷該li要新增的事件分類屬於新增區塊還是已完成區塊
 * @param {*} liItem 新建立的li
 */
function addCategory(liItem) {
    for(let i = 0 ; i < todoCategorys.length ; i++){
        if(category === todoCategorys[i].name){
            if(liItem.children[1].classList.contains('fa-check-square')){
                doneTodoUls[i].appendChild(liItem)
            }else{
                newTodoUls[i].appendChild(liItem)
            }
        }
    }
}

/**新增代辦事項
 * 1. 未選擇事件分類或未輸入內容，提示使用者
 * 2. 有選擇事件分類及輸入內容，新增內容至ul及物件陣列
 */
function inputTodo() {
      const inputValue = newTodoinput.value
      if( !category || !inputValue){
            alert("您沒有選擇事件分類或是未輸入代辦事項內容，無法新增！請選擇事件分類及輸入代辦事項內容！")
      }else{
            addItem(inputValue)
            pushTodoItem(inputValue)
            newTodoinput.value = null
            category = null
            document.querySelector("#dropdownMenuButton").innerHTML = "事件分類"
      }     
}

/**新增新的代辦事項至對應的物件陣列
 * (練習switch case break)
 * @param {*} text 新的代辦事項
 */
function pushTodoItem(text) {
      switch(category){
        case todoCategorys[0].name:
            todoCategorys[0].todos.push(text)
            break
        case todoCategorys[1].name:
            todoCategorys[1].todos.push(text)
            break
        case todoCategorys[2].name:
            todoCategorys[2].todos.push(text)
            break
        case todoCategorys[3].name:
            todoCategorys[3].todos.push(text)
            break                        
      }
}

/**Enter按鍵事件
 * 1. 新增新代辦事項
 * 2. 搜尋代辦事項
 * @param {*} event 
 */
function inputKeypress (event) {
        target = event.target
        const id = target.id
        if(event.keyCode == 13){
            if( id == "newTodo"){
                inputTodo()
            }else{           
                category = this.parentElement.previousElementSibling.innerHTML
                const searchValue = this.children[0].value             
                const searchPanel = document.querySelector('#'+target.dataset.panel)
                if(!searchValue){
                    alert("您未輸入任何內容，無法搜尋！請重新輸入！")
                }else{
                    searchTodo(searchValue , searchPanel , searchPanel.id)                   
                }                
            }            
        }
}

/**搜尋該事件分類內的事件
 * 1. 無輸入任何內容出現提示訊息
 * 2. 取得搜尋框輸入的關鍵字、顯示搜尋結果區塊及id後，傳入searchTodo
 * @param {*} event 監聽事件
 */
function search (event) {
    target = event.target
    category = this.parentElement.previousElementSibling.innerHTML
    const searchValue = this.children[0].value
    const searchPanel = document.querySelector('#'+this.children[0].dataset.panel)
    
    if(target.classList.contains("search") || target.classList.contains("fa-search")){
        if(!searchValue){
            alert("您未輸入任何內容，無法搜尋！請重新輸入！")
        }else{            
            searchTodo(searchValue , searchPanel , searchPanel.id)
        }
    }
}

/**與資料物件陣列進行比對後顯示搜尋結果
 * 1. 搜尋筆數為0，代表查無資料，需出現提示
 * 2. 判斷顯示搜尋結果區塊的ID是在新增代辦事項區塊還是以完成代辦事項區塊
 * 3. 藉由forEach、category將關鍵字與對應的資料陣列進行比對
 * 4. 顯示結果
 * @param {*} searchValue 搜尋關鍵字
 * @param {*} searchPanel 搜尋結果顯示ul區塊
 * @param {*} panelId 搜尋結果顯示ul區塊的id
 */
function searchTodo(searchValue , searchPanel , panelId) {
    let searchCount = 0
    todoCategorys.forEach(todoCategory => {
        if(category === todoCategory.name){
            if(panelId.indexOf('todo') > -1){
                todoCategory.todos.forEach(todo => {
                    if(todo.indexOf(searchValue) > -1){
                        searchCount ++
                        if(searchCount == 1){
                            searchPanel.innerHTML = null
                        }
                        addItem(todo)
                    }
                })
            }else if(panelId.indexOf('done') > -1){
                todoCategory.dones.forEach(done => {
                    if(done.indexOf(searchValue) > -1){
                        searchCount ++
                        if(searchCount == 1){
                            searchPanel.innerHTML = null
                        }
                        addDone(done)
                    }
                })
            }
        }
    })

    if(searchCount == 0){
        alert("查無資料")
    }
    category = null
}

/**各事件分類區塊進行重整
 * @param {*} event
 */
function redo(event) {
    target = event.target
    category = this.parentElement.previousElementSibling.innerHTML
    const searchInput = this.children[0]
    const redoPanelId = searchInput.dataset.panel
    const redoPanel = document.querySelector('#'+redoPanelId)
    
    if(target.classList.contains("redo") || target.classList.contains("fa-redo-alt")){
        redoPanel.innerHTML = null
        searchInput.value = null        
        todoCategorys.forEach(todoCategory => {
            if(todoCategory.name === category){
                if(redoPanelId.indexOf('todo')>-1){
                    todoCategory.todos.forEach(todo => {
                        addItem(todo)
                    })
                }else if(redoPanelId.indexOf('done')>-1){
                    todoCategory.dones.forEach(done => {
                        addDone(done)
                    })
                }
            }
        })
        category = null
    }
}

/**刪除與確定完成
 * 1. 點擊垃圾桶後傳送刪除節點至deleteli()
 * 2. 點擊項目文字代表完成該事項
 * 2.1 將該事項移至已完成代辦事項對應的事件分類列表
 * 2.2 將該事項新增至完成資料陣列內
 * 2.3 將該事項由原列表刪除
 * @param {*} event 
 */
function deleteAndCheck(event) {
    target = event.target
    category = this.parentElement.children[0].children[0].innerHTML
    let parentElement

    if(target.classList.contains('delete')){
        parentElement = target.parentElement
        deleteli(parentElement)    
    }else if(target.tagName === "LABEL"){
        parentElement = target.parentElement
        addDone(target.innerHTML)
        pushDoneItem(target.innerHTML)
        deleteli(parentElement)        
    }
    category = null
}

/**刪除項目
 * 1. 移除該項目節點
 * 2. 將該項目由代辦事項資料陣列中移除
 * @param {*} parentElement 
 */
function deleteli(parentElement) {
    parentElement.remove()
    todoCategorys.forEach(todoCategory => {
        if(todoCategory.name === category){
            todoCategory.todos.forEach(function (todo , index) {
                if(todo === parentElement.children[0].innerHTML){
                    todoCategory.todos.splice(index , 1)
                }
            })
        }
    })
}

/**新增新的完成代辦事項至對應的完成事項資料陣列
 * @param {*} text 新的完成代辦事項文字
 */
function pushDoneItem(text) {
    todoCategorys.forEach(todoCategory =>{
        if(todoCategory.name === category){
            todoCategory.dones.push(text)
        }
    })
}


const $btnOpenDeal = $("#open-deal-modal")
const $btnCloseDeal = $(".close-icon-deal")
const btnsOpenCloseColumn = Array.from($(".open-close-column"))
const btnsOpenCloseFlow = Array.from($(".open-close-flow"))
const $kanbanFlow = $(".kanban-flow")


let arrFlows = []
let id = 0;


window.onload = () => {
    updateArrFlows()
    updateID()
    displayKanban()
}

//--- Open and Close Modals

$btnOpenDeal.click(() => {
    openCloseModal($(".modal-create-deal"))
    makeSelect()
})

$btnCloseDeal.click(() => {
    openCloseModal($(".modal-create-deal"))
})

btnsOpenCloseColumn.forEach(button => {
    button.addEventListener("click", () => {
        let permissionCreateColumn = checkPermission()

        if(!permissionCreateColumn) return alert("Você precisa primeiro criar um fluxo ")
        
        openCloseModal($(".modal-create-column"))
    })
})

btnsOpenCloseFlow.forEach(button => {
    button.addEventListener("click", () => openCloseModal($(".modal-create-flow")))
})


//--- Create Deal

$("#create-deal").click((e) => {
    e.preventDefault()
    
    createDeal()
    openCloseModal($(".modal-create-deal"))

    cleanInput([$("#name"),$("#desc")])
    

})

// Create Column

$("#create-column").click((e) => {
    e.preventDefault()

    let name = $("#name-column").val()
    
    createColumn(name)
    openCloseModal($(".modal-create-column"))
    cleanInput($("#name-column"))
})

// Create Flow

$("#create-flow").click((e) => {
    e.preventDefault()
    createFlow()
})

// Change Flow on Select

$("#flow").change(() => {
    const $selectVal = $("#flow").val()
    let flows = JSON.parse(localStorage.getItem("flow"))
    
    flows.forEach(flow => {
        if(flow.id == $selectVal) {
            criaKanban(flow)
            
        }
        
        
    })
    
    
})

// ----  FUNCTIONS  -----


function createFlow() {
    let name = $("#name-flow").val()
    
    const flow = 
        {
        title: name,
        id: createID(),
        columns: ''
        }

    arrFlows.push(flow)
 
    localStorage.setItem("flow", JSON.stringify(arrFlows))    
      
    updateFlowsSelect(flow.id, flow.title)

    $kanbanFlow.html("<p class='no-columns-warn p-1 d-flex justify-content-center align-items-center'>Ainda não há colunas, crie sua primeira</p>")
    $(".modal-create-flow").toggleClass('d-none')


}

function updateFlowsSelect(id, title){

    let selectFlowHTML = $("#flow").html()
    let optionHTML = `<option selected value="${id}">${title}</option>` 
    selectFlowHTML += optionHTML
    $("#flow").html(selectFlowHTML)

    localStorage.setItem("selectOptions", $("#flow").html())
    
}

function createID(){
    id += 1
    localStorage.setItem('lastID', id)
    return id
}

function criaKanban(flow) {

    if (flow.columns != "") {
        
        $(".kanban-flow").html("") 
        flow.columns.forEach(column => {
    
            let cardsHTML = displayCards(column)
            if (!cardsHTML) {
                cardsHTML = ""
            }
            const columnHTML = `
            <div class="kanban-column col-3">
              <div contenteditable class="title d-flex align-items-center justify-content-center fw-500 mb-1">
                <p>${column.title}</p>
              </div>
              <div id="${column.id}" class="deals px-1">
                ${cardsHTML}
              </div>
            </div>
            `
    
            $(".kanban-flow").append(columnHTML)
            
        })

        return
    }

    $kanbanFlow.html("<p class='no-columns-warn p-1 d-flex justify-content-center align-items-center'>Ainda não há colunas, crie sua primeira</p>")
    
}

function displayCards(column) {
    let cardsHTML = '';

    if (column.cards) {
        column.cards.forEach(card => {
            const cardHTML = `
            <div class="deal col-12 box-shadow-subtle p-10px bg-white-2 mb-1">
                <h3 class="h3 fw-500 mb-1">${card.title}</h3>
                <p class="h4">${card.desc}</p>
            </div>
            `
        
        cardsHTML += cardHTML
        })
    
        return cardsHTML 
    }
    
}

function createDeal(){
    let $name = $("#name").val()
    let $desc = $("#desc").val()
    let $column = $("#column").val()

    const deal = `
    <div class="deal col-12 box-shadow-subtle p-10px bg-white-2 mb-1">
              <h3 class="h3 fw-500 mb-1">${$name}</h3>
              <p class="h4">${$desc}</p>
            </div>
    `
    $(`#${$column}`).append(deal)
    
    updateCardsInLocalStorage($name, $desc)
}

function createColumn(name){
    let id = createID()
    const column = `
    <div class="kanban-column col-3">
          <div contenteditable class="title d-flex align-items-center justify-content-center fw-500 mb-1">
            <p>${name}</p>
          </div>
          <div id="${id}" class="deals px-1">
          </div>
        </div>
    `
    $(".no-columns-warn").remove()
    $(".kanban-flow").append(column)

    arrFlows.forEach(flow => {
        if (flow.id == $("#flow").val()) {
            flow.columns = [
                ...flow.columns,
                {
                    title: name,
                    id: id,
                    cards: ""
                }
            ]
            
            localStorage.setItem("flow", JSON.stringify(arrFlows))
        }
    })

}

function openCloseModal (modal) {
    modal.toggleClass('d-none')
}


function cleanInput(inputList){
    inputList.forEach(input => input.val(""))
}

function makeSelect() {

    let flows = JSON.parse(localStorage.getItem("flow"))
    createColumnSelect()
    createOptions(flows)
    
}

function createColumnSelect() {

    $(".select-div").html("")

    const selectHTML = `
        <select name="column" id="column" class="modal-input">
        </select>
        `

        $(".select-div").html(selectHTML)
}

function createOptions(flows){
    
    flows.forEach(flow => {
           
        if($("#flow").val() == flow.id) {
            
            flow.columns.forEach(column => {
                let option = document.createElement('option')
                option.setAttribute("value", column.id)
                option.innerText = column.title

                $("#column").append(option)
                
            })
        }
        
    })
}

function updateArrFlows() {
    const selectOptions = localStorage.getItem("selectOptions")
    $("#flow").html(selectOptions)
    const flows = JSON.parse(localStorage.getItem("flow"))

    
    if (flows) {

        flows.forEach(flow => {
            arrFlows.push(flow)
        })
        
    }
}

function updateID() {
    const selectOptions = Number(localStorage.getItem("lastID"))
    id = selectOptions
}

function displayKanban() {
    const flows = JSON.parse(localStorage.getItem("flow"))
    const $selectVal = $("#flow").val()
    flows.forEach(flow => {
        if(flow.id == $selectVal) {
            criaKanban(flow)
        }
    })
}

function checkPermission(){
    let flowExists = checkFlow()
    console.log(flowExists)
    if(flowExists) return true
    return false
}

function checkFlow () {
    const $selectFlowVal = $("#flow").val()
    const flows = JSON.parse(localStorage.getItem("flow"))
    
    if ($selectFlowVal != null) {
            return true
        }
    
            
}

function updateCardsInLocalStorage(name,desc) {
    arrFlows.forEach(flow => {
        if (flow.id == $("#flow").val()) {
            flow.columns.forEach(column => {

                if(column.id == $("#column").val()){
                    
                    column.cards = [
                        ...column.cards,
                        {
                            title: name,
                            desc: desc
                        }
                    ]
                }
            })

            localStorage.setItem("flow", JSON.stringify(arrFlows))
        }
    })
}
    
   












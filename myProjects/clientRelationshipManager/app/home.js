window.onload = () => {
    const flows = JSON.parse(localStorage.getItem("flow"))
    console.log(flows)

    flows.forEach(flow => criaFluxoCard(flow))
    
    

}

function criaFluxoCard(flow){


    
    const card = `
    <div class="fluxo-card mr-1 col-2 bg-blue p-1 box-shadow-subtle pointer">
        <div class="box-top">
            <div class="square -white"></div>
        </div>
        <div class="card-title">
            <h3 class="h3 fw-500">${flow.title}</h3>
        </div>
    </div>
    `

    const fluxosContainer = $(".fluxos-container")
    fluxosContainer.append(card)

}
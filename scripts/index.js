
function click() {
    const log = document.querySelector('.replace_log')
    const cadastr = document.querySelector('.replace_casdatr')

    log.addEventListener('click', () => {
        location.replace('pages/login.html')
    })
    cadastr.addEventListener('click', () => {
        location.replace('pages/register.html')
    })
}
click()

async function change() {
    const responseJSON = await fetch('http://localhost:3333/companies/readAll')
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function renderOptionCompanies(name) {
    const responseJSON = await fetch(`http://localhost:3333/companies/readByCategory/${name}`)
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}


async function getCategories() {
    const responseJSON = await fetch('http://localhost:3333/categories/readAll')
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function renderCompanies(array = undefined) {
    const menu = document.querySelector('.setores')
    menu.innerHTML = ''
    menu.insertAdjacentHTML('afterbegin',`
    <h2>Lista de Empresas</h2>
    ` )

    const list = array || await change()
    const listaaa = await getCategories()

    list.forEach((elementt) => {
        const category = listaaa.filter((gg) => gg.id == elementt.category_id)

        menu.insertAdjacentHTML('beforeend', `
        <div class="setores_lista">
        <p><strong>${elementt.name}</strong></p>
        <p id='${elementt.category_id}' class='setores_lista_p'>${category[0].name}</p>
    </div>
    `)
    })

}
renderCompanies()

async function criarSelect() {
    const categories = await getCategories()
    const optionSection = document.querySelector('#plano')

    categories.forEach(element => {
        optionSection.insertAdjacentHTML('beforeend', `
        <option id='${element.id}' value="${element.name}">${element.name}</option>
        `)
    });

    optionSection.addEventListener('change', async () => {
        const name = optionSection.value
        const company = await renderOptionCompanies(name)
        renderCompanies(company)
        if(name==""){
        renderCompanies()
        }
    })
}

criarSelect()
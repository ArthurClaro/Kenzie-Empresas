function prev() {
    const token = localStorage.getItem('Token')
    const isAdm = JSON.parse(localStorage.getItem('isAdm?'))

    // console.log(isAdm)
    if (token == null || isAdm == false || isAdm == null) {
        alert('Usuário não autorizado/logado')
        // localStorage.clear()
        location.replace("login.html")
    }
}
prev()


function back() {
    const back = document.querySelector('.exit')
    back.addEventListener('click', () => {
        location.replace("login.html")
    })
}
back()

function toast(message, color) {

    Toastify({
        text: message,
        duration: 3000,
        // destination: "https://github.com/apvarun/toastify-js",
        // newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

const green = '#168821'
const red = '#df1545'


async function companies() {
    const responseJSON = await fetch(`http://localhost:3333/companies/readAll`, {
        method: 'GET'
    })
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function departments() {
    const token = localStorage.getItem('Token')

    const responseJSON = await fetch('http://localhost:3333/departments/readAll', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}
async function departmentsRender(array = undefined) {
    const depart = array || await departments()
    const lista = document.querySelector('.departments_container')
    const companyAll = await companies()

    lista.innerHTML = ''
    depart.forEach(elemet => {

        const company = companyAll.filter((gg) => gg.id == elemet.company_id)

        lista.insertAdjacentHTML('beforeend', `
            
            
            <div id='${elemet.id}' class="box">
            <div class="box_left">
            <p class='box_departm_name'><strong>${elemet.name}</strong></p>
            <p class='box_descripit_name'>${elemet.description}</p>
            <p class='box_company_name'>${company[0].name}</p>
            </div>
            <div class="box_right">
            <p id='${elemet.id}' class='box_right_show'><i class="fa-sharp fa-regular fa-eye"></i></p>
            <p id='${elemet.id}' class='box_right_edit'><i class="fa-regular fa-pen-to-square"></i></p>
            <p id='${elemet.id}' class='box_right_del'><i class="fa-regular fa-trash-can"></i></p>
            </div>
            
            </div>
            
            `)

    })
    abrirModalDel()
    openModalEdit()
    abrirModalShow()

}
departmentsRender()

async function changeCompanies() {

    const lista = document.querySelector('.departments_container')

    const select = document.querySelector('#plano')
    select.addEventListener('change', async () => {
        const depart = await departments()
        const companyAll = await companies()

        console.log(select.value)
        if (select.value !== "") {

            const array = companyAll.find((gg) => {

                const name = gg.name
                const name2 = select.value
                if (name == name2) {
                    return gg
                }
            })
            companyAll.forEach((elemete) => {
                // console.log(elemete)
                if (elemete.name == array.name) {
                    const departm = depart.filter((index) => index.company_id == elemete.id)
                    console.log(departm)
                    if (departm.length == 0) {
                        lista.innerHTML = ''
                        lista.insertAdjacentHTML('beforeend', `
                    <p class="departments_container_center">Empresa ${array.name} não possui departamentos</p>
                    `)
                    } else {
                        lista.innerHTML = ''
                        departmentsRender(departm)
                    }
                }
            })
        } else {
            lista.innerHTML = ''
            departmentsRender()
        }
        // console.log(array)
    })
}
changeCompanies()

async function selectEmpresa() {
    const companyAll = await companies()
    const select = document.querySelector('#plano')
    companyAll.forEach((element) => {
        select.insertAdjacentHTML('beforeend', `
        <option value="${element.name}">${element.name}</option> -->
        `)
    })
}
selectEmpresa()


function abrirModalCreate() {
    const modalCreate = document.querySelector('#modalCreate')
    const btnCriar = document.querySelector('.departments_top--openModalCreate')
    btnCriar.addEventListener('click', () => {
        modalCreate.showModal()
    })
    const btnClose = document.querySelector('.create_TopRight--close')
    btnClose.addEventListener('click', () => {
        modalCreate.close()
    })
    const btnCloseAndCreate = document.querySelector('.create_go')
    btnCloseAndCreate.addEventListener('click', () => {
        modalCreate.close()
    })
}
abrirModalCreate()


async function createDepartment(obj) {
    const token = localStorage.getItem('Token')
    const post = await fetch('http://localhost:3333/departments/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast("Departamento criado com sucesso", green)
            changeCompanies()
            departmentsRender()

            console.log(resJson)
            return resJson
        })
        .catch((err) => console.log(err))
}
async function companyInOptionModal() {
    const select = document.querySelector('#create_select')
    const companyAll = await companies()
    companyAll.forEach((element) => {
        // console.log(element)
        select.insertAdjacentHTML('beforeend', `
        <option value="${element.id}">${element.name}</option> -->
        `)
    })
}
companyInOptionModal()

async function createDepartmentInModal() {
    const name = document.querySelector('.create_name')
    const description = document.querySelector('.create_descrpt')
    const company_id = document.querySelector('#create_select')

    const lista = document.querySelector('.departments_container')

    const btnCloseAndCreate = document.querySelector('.create_go')
    btnCloseAndCreate.addEventListener('click', () => {
        let data = {
            "name": `${name.value}`,
            "description": `${description.value}`,
            "company_id": `${company_id.value}`
        }
        console.log(data)
        lista.innerHTML = ''
        createDepartment(data)
    })
}
createDepartmentInModal()


async function delDepartment(departmentId) {
    const token = localStorage.getItem('Token')

    const responseJSON = await fetch(`http://localhost:3333/departments/delete/${departmentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast('Departamaneto deletado com sucesso', green)
            departmentsRender()

            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}


async function abrirModalDel() {
    const modalDel = document.querySelector('#modalDel')
    const btnDel = document.querySelectorAll('.box_right_del')
    const btnCloseAndDel = document.querySelector('.del_go')

    const depart = await departments()
    const h2 = document.querySelector('.del h2')

    btnDel.forEach((element) => {
        element.addEventListener('click', () => {
            const nameDepart = depart.filter((gg) => gg.id == element.id)
            h2.innerHTML = `Realmente deseja remover o Departamento ${nameDepart[0].name} e demitir seus funcionários ?`
            btnCloseAndDel.setAttribute('id', element.id)
            modalDel.showModal()
        })
    })

}
function updateDel() {
    const modalDel = document.querySelector('#modalDel')
    const btnClose = document.querySelector('.del_closeTopRight')
    const btnCloseAndDel = document.querySelector('.del_go')

    const lista = document.querySelector('.departments_container')

    btnClose.addEventListener('click', () => {
        modalDel.close()
    })
    btnCloseAndDel.addEventListener('click', async () => {
        lista.innerHTML = ''
        await delDepartment(btnCloseAndDel.id)
        usersRender()
        modalDel.close()
    })
}
updateDel()

async function editDepart(obj, DepartmetId) {
    const token = localStorage.getItem('Token')
    const responseJSON = await fetch(`http://localhost:3333/departments/update/${DepartmetId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast('Departamento editado com sucesso', green)
            departmentsRender()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function openModalEdit() {
    const showModalEdit = document.querySelector('#modalEditDepartment')
    const btnAllEdit = document.querySelectorAll('.box_right_edit')
    const btnEditGo = document.querySelector('.editDp_go')

    const depart = await departments()
    const descriptionText = document.querySelector('.editDp_description')

    btnAllEdit.forEach((element) => {
        element.addEventListener('click', () => {
            const descripitionDepart = depart.filter((gg) => gg.id == element.id)
            descriptionText.value = `${descripitionDepart[0].description}`

            btnEditGo.setAttribute('id', element.id)
            showModalEdit.showModal()
        })
    })
}
function editDepartmentGo() {
    const showModalEdit = document.querySelector('#modalEditDepartment')
    const closeTopRight = document.querySelector('.editDp_TopRightClose')
    const btnEditGo = document.querySelector('.editDp_go')

    const lista = document.querySelector('.departments_container')
    const descriptionText = document.querySelector('.editDp_description')

    closeTopRight.addEventListener('click', () => {
        showModalEdit.close()
    })
    btnEditGo.addEventListener('click', () => {
        let data = {
            description: `${descriptionText.value}`
        }
        lista.innerHTML = ''
        editDepart(data, btnEditGo.id)
        showModalEdit.close()
    })
}
editDepartmentGo()


async function abrirModalShow() {
    const btn = document.querySelectorAll('.box_right_show')
    const modal = document.querySelector('#modalShow')
    const armazemId = document.querySelector('.show')

    const depart = await departments()
    const companyAll = await companies()

    const nomeDepart = document.querySelector('.show_article h2')
    const descrDepart = document.querySelector('.show_article_descrp')
    const companyDepart = document.querySelector('.show_article_comp')

    const select = document.querySelector('#show_user_select')
    const armazIdUser = document.querySelector('.show_article_div_contat')

    const section = document.querySelector('.show_article section')

    const usersDepart = await users()

    btn.forEach((element) => {

        element.addEventListener('click', () => {
            const arr = depart.filter((gg) => gg.id == element.id)
            nomeDepart.innerHTML = `${arr[0].name}`
            descrDepart.innerHTML = `${arr[0].description}`
            const company = companyAll.filter((elem) => elem.id == arr[0].company_id)
            companyDepart.innerHTML = `${company[0].name}`
            armazemId.setAttribute('id', element.id)

            const users = usersDepart.filter((ee) => ee.department_id == element.id)
            // console.log(users)
            if (users.length !== 0) {

                users.forEach((elementt) => {
                    section.innerHTML = ''

                    section.insertAdjacentHTML('beforeend', `
                    <div class="modal_show_users">
                    <p class="modal_show_users_name">${elementt.name}</p>
                    <p class="modal_show_users_company">${company[0].name}</p>
                    <button id='${elementt.id}' class="modal_show_users_off">Desligar</button>
                    </div>
                    `)

                    dimissGoEmployee()
                })
            } else {
                section.innerHTML = ''
                section.insertAdjacentHTML('beforeend', `
                <p class="nafhenUsers">Este departamento não possui contratados</p>
                `)
            }

            const usersNull = usersDepart.filter((ee) => ee.department_id == null)
            // console.log(usersNull)
            armazIdUser.id = ''
            select.innerHTML = ''
            select.insertAdjacentHTML('afterbegin', `
            <option value="">Selecionar usuário</option>
            `)
            usersNull.forEach((element) => {
                select.addEventListener('change', () => {
                    armazIdUser.setAttribute('id', select.value)
                })

                select.insertAdjacentHTML('beforeend', `
                <option value="${element.id}">${element.name}</option>
                `)
            })

            modal.showModal()


        })
    })
}

async function dimissEmploy(userId) {
    const token = localStorage.getItem('Token')
    const responseJSON = await fetch(`http://localhost:3333/employees/dismissEmployee/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast(resJson.message, green)
            console.log(resJson)
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function dimissGoEmployee() {
    const btnOff = document.querySelectorAll('.modal_show_users_off')
    const modal = document.querySelector('#modalShow')
    const lista = document.querySelector('.departments_container')

    btnOff.forEach((element) => {
        element.addEventListener('click', async () => {
            lista.innerHTML = ''
            await dimissEmploy(element.id)
            await abrirModalShow()
            await departmentsRender()
            await usersRender()
            modal.close()
        })
    })
}


async function hireEmploy(obj, userId) {
    const token = localStorage.getItem('Token')
    const responseJSON = await fetch(`http://localhost:3333/employees/hireEmployee/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast(resJson.message, green)
            departmentsRender()
            usersRender()
            console.log(resJson)
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}

async function hireGoEmployee() {
    const armazemId = document.querySelector('.show')
    const armazIdUser = document.querySelector('.show_article_div_contat')
    const modal = document.querySelector('#modalShow')

    const erro = document.querySelector('.shoe_error')
    const lista = document.querySelector('.departments_container')

    armazIdUser.addEventListener('click', () => {

        let data = {
            department_id: `${armazemId.id}`
        }

        if (armazIdUser.id == "") {
            erro.style.display = 'flex'
        } else {
            erro.style.display = 'none'
            lista.innerHTML = ''
            modal.close()
            hireEmploy(data, armazIdUser.id)
        }
    })
}
hireGoEmployee()


async function fecharModalShow() {
    const modal = document.querySelector('#modalShow')

    const select = document.querySelector('#show_user_select')
    const section = document.querySelector('.show_article section')

    const erro = document.querySelector('.shoe_error')



    const close_showModalX = document.querySelector('.show_closeTopRight')
    close_showModalX.addEventListener('click', () => {
        erro.style.display = 'none'
        section.innerHTML = ''
        select.innerHTML = ''
        select.insertAdjacentHTML('beforeend', `
        <option value="">Selecionar usuário</option>
        `)
        modal.close()
    })
}
fecharModalShow()














































































// ////////////////////////////// USER ////////////////////////////////////////////


async function users() {
    const token = localStorage.getItem('Token')

    const responseJSON = await fetch('http://localhost:3333/employees/readAll', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON

}
async function usersRender() {
    const usersLista = await users()
    const lista = document.querySelector('.user_container')
    const companyAll = await companies()
    let companhia = ''

    lista.innerHTML = ''
    usersLista.forEach((element) => {

        if (element.company_id == null || element.department_id == null) {
            companhia = "Usuario sem companhia"
        } else {
            const company = companyAll.filter((fil) => fil.id == element.company_id)
            companhia = company[0].name
        }

        lista.insertAdjacentHTML('beforeend', `
        
        <div id="usersBox ${element.id}" class="box userContain">
        <div class="box_left">
            <p class='user_name'><strong>${element.name}</strong></p>
            <p class='user_company'>${companhia}</p>
        </div>
        <div class="box_right">
            <p id='${element.id}' class='edit_btn'><i class="fa-regular fa-pen-to-square"></i></p>
            <p id='${element.id}' class='del_btn'><i class="fa-regular fa-trash-can"></i></p>
        </div>
    </div>
        `)

    })
    clickDel()
    clickEdit()

}
usersRender()

async function editUser(obj, userId) {
    const token = localStorage.getItem('Token')
    const responseJSON = await fetch(`http://localhost:3333/employees/updateEmployee/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            if (res.ok) {
                toast('Usuário editado com sucesso', green)
                usersRender()
                departmentsRender()
                return resJson
            } else {
                throw new Error(resJson.message)
            }
        })
        .catch((err) => toast(err.message))
    return responseJSON
}

async function clickEdit() {
    const btnGo = document.querySelector('.edit_go')
    const btnDel = document.querySelectorAll('.edit_btn')
    const modalEdit = document.querySelector('#modalEdit')


    btnDel.forEach((element) => {
        element.addEventListener('click', () => {
            btnGo.setAttribute('id', element.id)
            modalEdit.showModal()
            closeModalEdit()
        })
    })
}
function update() {
    const btnGo = document.querySelector('.edit_go')
    const input_name = document.querySelector('.edit_text')
    const input_email = document.querySelector('.edit_email')
    const lista = document.querySelector('.departments_container')


    btnGo.addEventListener('click', () => {
        // console.log(btnGo)
        let data = {
            "name": `${input_name.value}`,
            "email": `${input_email.value}`
        }
        lista.innerHTML = ''
        editUser(data, btnGo.id)
        modalEdit.close()
        input_name.value = ''
        input_email.value = ''
    })
}
update()

function closeModalEdit() {
    const modalEdit = document.querySelector('#modalEdit')
    const closeModalEdit = document.querySelector('.edit_close')
    closeModalEdit.addEventListener('click', () => {
        modalEdit.close()
    })
}


async function delUser(userId) {
    const token = localStorage.getItem('Token')
    const responseJSON = await fetch(`http://localhost:3333/employees/deleteEmployee/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            toast('Usuário deletado com sucesso', green)
            usersRender()
            departmentsRender()
            return resJson
        })
        .catch((err) => {
            console.log(err)
        })
    return responseJSON
}
async function clickDel() {
    const btnDel = document.querySelectorAll('.del_btn')
    const modalCLose = document.querySelector('#modalClose')
    const h3CLose = document.querySelector('.close_user')

    const usersLista = await users()
    h3CLose.innerHTML = ''

    btnDel.forEach((element) => {
        element.addEventListener('click', async (e) => {
            console.log(element)
            const name = usersLista.filter((gg) => gg.id == element.id)
            h3CLose.innerHTML = `<strong>Realmente deseja remover o usuário ${name[0].name} ?</strong>`
            modalCLose.showModal()
            closeModalDel()
            const go = document.querySelector('.close_go')
            go.setAttribute('id', element.id)

        })
    })
}
function closeGoDelUser() {
    const lista = document.querySelector('.departments_container')
    const go = document.querySelector('.close_go')
    const modalCLose = document.querySelector('#modalClose')
    go.addEventListener('click', () => {
        lista.innerHTML = ''
        delUser(go.id)
        modalCLose.close()
    })
}
closeGoDelUser()

function closeModalDel() {
    const modalCLose = document.querySelector('#modalClose')
    const closeModalDel = document.querySelector('.close_TopRight')
    closeModalDel.addEventListener('click', () => {
        modalCLose.close()
    })
}
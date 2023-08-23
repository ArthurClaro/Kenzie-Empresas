function prev() {
    const token = localStorage.getItem('Token')
    const isAdm = JSON.parse(localStorage.getItem('isAdm?'))

    if (token == null || isAdm == true) {
        alert('Usuário não autorizado/logado')
        location.replace("login.html")
    }
}
prev()

function back() {
    const btn = document.querySelector('.logout')
    btn.addEventListener('click', () => {
        location.replace('login.html')
    })
}
back()

async function takeId() {
    const token = localStorage.getItem('Token')
    const name = document.querySelector('.user h2')
    const mail = document.querySelector('.user p')


    const h2 = document.querySelector('.works h2')
    const h4 = document.querySelector('.works h4')
    const article = document.querySelector('.works article')
    const works = document.querySelector('.works')


    const infos = await fetch('http://localhost:3333/employees/profile', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(async (res) => {
            const resJson = await res.json()
            if (res.ok) {
                if (resJson.department_id == null) {
                    h2.style.display = 'flex'
                    h4.style.display = 'none'
                    article.style.display = 'none'
                    works.style.border = '1px solid rgba(0, 0, 0, 0.30) '
                } else {
                    h2.style.display = 'none'
                    h4.style.display = 'flex'
                    article.style.display = 'flex'
                }
                name.innerHTML = resJson.name
                mail.innerHTML = resJson.email
                return resJson
            } else {
                throw new Error(resJson.message)
            }
        })
        .catch(err => {
            console.log(err)
        })
    return infos
}
takeId()

async function departments(departmentId) {
    const token = localStorage.getItem('Token')

    const responseJSON = await fetch(`http://localhost:3333/departments/readById/${departmentId}`, {
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

async function renderCards() {
    const seaa = await takeId()
    const idCompany = seaa.department_id
    const depart = await departments(idCompany)
    const article = document.querySelector('.works article')
    const nameCompany = document.querySelector('.works h4')
    let name = `${depart.company.name} - ${depart.name}`
    nameCompany.innerHTML = `${name}`
    depart.employees.forEach((element) => {
        article.insertAdjacentHTML('beforeend', `
        <div class="works_div">
        <p><strong>${element.name}</strong></p>
    </div>
        `)

    })
}
renderCards()
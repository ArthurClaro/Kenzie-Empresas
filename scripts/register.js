function back() {
    const log = document.querySelector('.replace_log')
    const home = document.querySelector('.replace_home')
    const retrn = document.querySelector('.replace_return')
    log.addEventListener('click', () => {
        location.replace('login.html')
    })
    home.addEventListener('click', () => {
        location.replace('../index.html')
    })
    retrn.addEventListener('click', () => {
        location.replace('../index.html')
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

async function register(obj) {

    const responseJSON = await fetch('http://localhost:3333/employees/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            if (res.ok) {
                toast("Cadastro realizado com sucesso", green)
                setTimeout(() => {
                    location.replace('login.html')
                }, 5000);
                return resJson
            } else {
                throw new Error(resJson.message)
            }
        })
        .catch((err) => {
            console.log(err)
            toast(err.message, red)
        })

}

function confirm() {
    const name = document.querySelector('.register_name')
    const email = document.querySelector('.register_email')
    const password = document.querySelector('.register_pass')

    const btn = document.querySelector('.register_go')
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        let data = {
            name: `${name.value}`,
            email: `${email.value}`,
            password: `${password.value}`
        }
        if (name.value !== '' || email.value !== '' || password.value !== '') {
            register(data)
        } else {
            toast('Preencha todos os campos', red)
        }
    })
}
confirm()
function back(){
    const home = document.querySelector('.replace_home')
    const cadastro = document.querySelector('.replace_casdatr')
    const cadastr_log = document.querySelector('.replace_log')

    home.addEventListener('click',()=>{
        location.replace('../index.html')
    })
    cadastro.addEventListener('click',()=>{
        location.replace('register.html')
    })
    cadastr_log.addEventListener('click',()=>{
        location.replace('register.html')
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
        stopOnFocus: true, 
        style: {
            background: color,
        },
        onClick: function () { } 
    }).showToast();
}

const green = '#168821'
const red = '#df1545'

async function log(obj) {

    const responseJSON = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(async (res) => {
            const resJson = await res.json()
            if (res.ok) {
                localStorage.setItem('Token', resJson.authToken)
                localStorage.setItem('isAdm?', resJson.isAdm)
                if(resJson.isAdm== false){
                toast("Login realizado com sucesso, redirecionando para Página de usuário", green)
                    setTimeout(() => {
                        location.replace('userPage.html')
                    }, 4000);
                }else{
                    toast("Login realizado com sucesso, redirecionando para Dashboard ", green)
                    setTimeout(() => {
                        location.replace('dash.html')
                    }, 4000);
                }
                return resJson
            } else {
                throw new Error(resJson.message)
            }
        })
        .catch((err) => {
            console.log(err)
            toast(err.message, red)
        })

    return responseJSON
}

function confirm() {
    const email = document.querySelector('.login_email')
    const password = document.querySelector('.login_pass')

    const btn = document.querySelector('.login_go')
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        let data = {
            email: `${email.value}`,
            password: `${password.value}`
        }
        if ( email.value == '' || password.value == '') {
            toast('Preencha todos os campos', red)
        } else {
            log(data)
        }
    })
}
confirm()
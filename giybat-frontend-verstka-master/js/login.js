function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;

    let hasError = false;

    if (username === null || username === 'undefined' || username.length === 0) {
        document.getElementById("usernameErrorSpan").style.display = 'block';
        usernameInput.style.borderColor = "red";
        hasError = true;
    }

    if (password === null || password === 'undefined' || password.length === 0) {
        passwordInput.nextElementSibling.style.display = 'block';
        passwordInput.style.borderColor = "red";
        hasError = true;
    }

    if (hasError) {
        return;
    }else {
        document.getElementById("usernameErrorSpan").style.display = 'none';
        usernameInput.style.borderColor = "#ddd";
        passwordInput.nextElementSibling.style.display = 'none';
        passwordInput.style.borderColor = "#ddd";
    }




    const body = {
        "username": username,
        "password": password
    }

    const lang = document.getElementById("current-lang").textContent;


    fetch("http://localhost:8081/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return response.text().then(text => Promise.reject(text));
            }
        }).then(item => {


        localStorage.setItem("userDetail",JSON.stringify(item));
        localStorage.setItem("jwtToken",item.jwt);

        passwordInput.value='';
        usernameInput.value='';

       window.location.href="./profile-post-list.html";

    }).catch(error => {
        const errorDiv = document.getElementById("loginError");
        errorDiv.textContent = error;
        errorDiv.style.display = "block";
    });


}
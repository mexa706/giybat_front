function resetPasswordConfirm() {
    const confirmCodeValue = document.getElementById("confirm_code").value;
    const newPasswordValue = document.getElementById("new_password").value;
    const username = localStorage.getItem("username");

    if (!confirmCodeValue || !newPasswordValue || !username) {
        alert("Please fill all inputs");
        return;
    }

    const body = {
        "username": username,
        "code": confirmCodeValue,
        "password": newPasswordValue,
    }

    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8081/auth/reset-password-confirm", {
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
                return Promise.reject(response.text());
            }
        }).then(item => {
        alert(item.message);
        window.location.href = "./login.html";

    }).catch(error => {
        error.then(errMessage => {
            alert(errMessage)
        })
    });

}
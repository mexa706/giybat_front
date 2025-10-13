window.addEventListener("DOMContentLoaded", function () {
    const userDetailJon = localStorage.getItem("userDetail");
    if (!userDetailJon) {
        return;
    }

    const userDetailObj = JSON.parse(userDetailJon);

    document.getElementById("profile_settings_name").value = userDetailObj.name;
    document.getElementById("profile_settings_username").value = userDetailObj.username;
    if (userDetailObj.photo) {
        document.getElementById("profile_settings_photo").src = userDetailObj.photo.url;
    }
});

function profileDetailUpdate() {

    const lang = document.getElementById("current-lang").textContent;

    const name = document.getElementById("profile_settings_name").value

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        window.location.href = 'login.html';
        return;
    }

    if (!name) {
        alert("Enter the name input. Mazgimisiz!")
        return;
    }

    const body = {
        "name": name
    }

    fetch("http://localhost:8081/profile/detail", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response.text());
            }
        }).then(item => {
        alert(item.message);

        const userDetailJon = localStorage.getItem("userDetail");
        const UserDetail = JSON.parse(userDetailJon);
        UserDetail.name = name;
        localStorage.setItem("userDetail", JSON.stringify(UserDetail));
        const headerUserNameSpan = document.getElementById("header_user_name_id");
        headerUserNameSpan.textContent = name;
    }).catch(error => {
        if (error instanceof Promise) {
            error.then(errMessage => {
                alert(errMessage);
            });
        } else {
            alert(error);
        }
    });


}

function profilePasswordUpdate() {
    const currentPswd = document.getElementById("profile_settings_current_pswd").value
    const newPswd = document.getElementById("profile_settings_new_pswd").value
    if (!currentPswd || !newPswd) {
        alert("Enter all inputs")
        return;
    }

    const body = {
        "oldPassword": currentPswd, "newPassword": newPswd
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    const lang = document.getElementById("current-lang").textContent;

    fetch("http://localhost:8081/profile/updatePswd", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response.text());
            }
        }).then(item => {
        alert(item.message);
        const currentPswd = document.getElementById("profile_settings_current_pswd").value = '';
        const newPswd = document.getElementById("profile_settings_new_pswd").value = '';
    }).catch(error => {
        if (error instanceof Promise) {
            error.then(errMessage => {
                alert(errMessage);
            });
        } else {
            alert(error);
        }
    });

}

function profileUserNameChange() {
    const lang = document.getElementById("current-lang").textContent;

    const username = document.getElementById("profile_settings_username").value
    if (!username) {
        alert("Enter all inputs")
        return;
    }
    const body = {
        "username": username
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    fetch("http://localhost:8081/profile/username", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response.text());
            }
        }).then(item => {
        document.getElementById("confirmModalResultId").textContent = item.message;
        openModal();

    }).catch(error => {
        if (error instanceof Promise) {
            error.then(errMessage => {
                alert(errMessage);
            });
        } else {
            alert(error);
        }
    });

}

function profileUserNameChangeConfirm() {
    const lang = document.getElementById("current-lang").textContent;

    const confirmCode = document.getElementById("profileUserNameChaneConfirmInputId").value
    if (!confirmCode) {
        alert("Enter all inputs")
        return;
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    const body = {
        "code": confirmCode
    }

    fetch("http://localhost:8081/profile/username/confirm", {
        method: 'PUT', headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response.text());
            }
        }).then(item => {
        closeModal();
        alert(item.message);
        localStorage.setItem("jwtToken", item.data);
        const userDetailJon = localStorage.getItem("userDetail");
        const UserDetail = JSON.parse(userDetailJon);
        UserDetail.username = document.getElementById("profile_settings_username").value;
        UserDetail.jwt = item.data;
        localStorage.setItem("username", document.getElementById("profile_settings_username").value);
        localStorage.setItem("userDetail", JSON.stringify(UserDetail));

    }).catch(error => {
        if (error instanceof Promise) {
            error.then(errMessage => {
                alert(errMessage);
            });
        } else {
            alert(error);
        }
    });

}

//------------ Change username confirm modal start ------------
const modal = document.getElementById('simpleModalId');

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

//------------ Change username confirm modal end ------------

// ------------ Image preview ------------
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById('profile_settings_photo');
        img.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
        document.getElementById('profile_settings_upload_img_btn_id').style.display = 'inline-block';
    }
}

// ------------ Image upload ------------
function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const jwt = localStorage.getItem('jwtToken');
        if (!jwt) {
            window.location.href = './login.html';
            return;
        }
        const lang = document.getElementById("current-lang").textContent;
        //
        // fetch('http://localhost:8080/attach/upload', {
        //     method: 'POST',
        //     headers: {
        //         'Accept-Language': lang,
        //         'Authorization': 'Bearer ' + jwt
        //     },
        //     body: formData
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Success:', data);
        //         if (data.id) {
        //             updateProfileImage(data.id); // profile update image
        //
        //             const userDetailJon = localStorage.getItem("userDetail");
        //             const userDetail = JSON.parse(userDetailJon);
        //             userDetail.photo = {};
        //             userDetail.photo.id = data.id;
        //             userDetail.photo.url = data.url;
        //             localStorage.setItem("userDetail", JSON.stringify(userDetail));
        //
        //             // document.getElementById("header_user_image_id").src =data.url;
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });
    }
}

function updateProfileImage(photoId) {
    if (!photoId) {
        return;
    }

    const body = {
        "photoId": photoId
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    const lang = document.getElementById("current-lang").textContent;
}
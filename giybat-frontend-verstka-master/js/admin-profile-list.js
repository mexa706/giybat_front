window.addEventListener("DOMContentLoaded", function () {
    getProfileList();
});
let currentPage = 1;
let pageSize = 6;

function getProfileList() {
    const jwt = localStorage.getItem('jwtToken');
    const lang = document.getElementById("current-lang").textContent;

    const body = {
        "query": null
    }


    fetch(`http://localhost:8081/profile/filter?page=${currentPage}&size=${pageSize}`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json', 'Accept-Language': lang, 'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {
            showProfileList(data.content);
            showPagination(data.totalElements);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showProfileList(profileList) {
    const container = document.getElementById("profile_list_container_id");
    container.innerHTML = '';

    if (profileList.length === 0) {
        return;
    }

    profileList.forEach((profile, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("tr");

        // number
        const tdNumber = document.createElement("td");
        tdNumber.classList.add("td");
        tdNumber.innerHTML = (currentPage - 1) * pageSize + index + 1;
        tr.appendChild(tdNumber);

        // image
        const tdImage = document.createElement("td");
        tdImage.classList.add("td");

        const img = document.createElement("img");
        img.classList.add("table_photo");

        if (profile.photo && profile.photo.url) {
            img.src = profile.photo.url;
        } else {
            img.src = "./images/default-user.png";
        }

        tdImage.appendChild(img);
        tr.appendChild(tdImage);

        // name
        const tdName = document.createElement("td");
        tdName.classList.add("td");
        tdName.innerHTML = profile.name;
        tr.appendChild(tdName);

        // username
        const tdUsername = document.createElement("td");
        tdUsername.classList.add("td");
        tdUsername.innerHTML = profile.username;
        tr.appendChild(tdUsername);

        // createdDate
        const tdDate = document.createElement("td");
        tdDate.classList.add("td");
        tdDate.innerHTML = dateFormat(profile.createdDate);
        tr.appendChild(tdDate);

        // post count
        const tdPostCount = document.createElement("td");
        tdPostCount.classList.add("td");
        tdPostCount.innerHTML = profile.postCount;
        tr.appendChild(tdPostCount);

        // roles
        const tdRoles = document.createElement("td");
        tdRoles.classList.add("td");
        tdRoles.innerHTML = profile.roles.join("<br>");
        tr.appendChild(tdRoles);


        // status
        const tdStatus = document.createElement("td");
        tdStatus.classList.add("td");

        const statusBtn = document.createElement("button");
        if (profile.status === "ACTIVE") {
            statusBtn.classList.add("table_btn", "table_btn_active");
            statusBtn.innerText = "ACTIVE";
        } else if (profile.status === "BLOCK") {
            statusBtn.classList.add("table_btn", "table_btn_block");
            statusBtn.innerText = "BLOCK";
        } else {
            statusBtn.classList.add("table_btn", "table_btn_in_registration");
            statusBtn.innerText = "IN_REGISTRATION";
        }


        statusBtn.onclick = function () {
            changeStatus(profile.id, profile.status);
        };

        tdStatus.appendChild(statusBtn);
        tr.appendChild(tdStatus);

        // delete icon
        const tdDelete = document.createElement("td");
        tdDelete.classList.add("td");

        const deleteImg = document.createElement("img");
        deleteImg.src = "./images/basket.svg";
        deleteImg.classList.add("table_basket", "hover-pointer");

        deleteImg.onclick = function () {
            deleteProfile(profile.id);
        };
        tdDelete.appendChild(deleteImg);
        tr.appendChild(tdDelete);


        container.appendChild(tr);
    });
}

function showPagination(totalElements, size) {
    let totalPageCount = Math.ceil(totalElements / pageSize);

    const paginationWrapper = document.getElementById("paginationWrapperId");
    paginationWrapper.innerHTML = '';

    if (totalPageCount === 0 || totalPageCount === 1) {
        return;
    }


    // previous button
    const prevDiv = document.createElement("div");
    prevDiv.classList.add("pagination_btn__box");

    const prevButton = document.createElement("button");
    prevButton.classList.add("pagination_btn", "pagination-back");
    prevButton.textContent = "Oldinga";
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            getProfileList();
        }
    }
    prevDiv.appendChild(prevButton);
    paginationWrapper.appendChild(prevDiv);

    // page numbers
    const pageNumberWrapper = document.createElement("div");
    pageNumberWrapper.classList.add("pagination_block");

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPageCount, currentPage + 2);

    if (startPage > 1) { // show first page
        addBtn(1, pageNumberWrapper, false, false)
        if (startPage > 2) { // add ...
            addBtn("...", pageNumberWrapper, false, true)
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        addBtn(i, pageNumberWrapper, i === currentPage)
    }

    if (endPage < totalPageCount) { // show last page
        if (endPage < totalPageCount - 1) { // add ...
            addBtn("...", pageNumberWrapper, false, true)
        }
        addBtn(totalPageCount, pageNumberWrapper, false, false)
    }


    paginationWrapper.appendChild(pageNumberWrapper);

    // next button
    const nextDiv = document.createElement("div");
    nextDiv.classList.add("pagination_btn__box");
    const nextButton = document.createElement("button");
    nextButton.classList.add("pagination_btn", "pagination-forward");
    nextButton.textContent = "Keyingi";
    nextButton.onclick = () => {
        if (currentPage < totalPageCount) {
            currentPage++;
            getProfileList();
        }
    }

    nextDiv.appendChild(nextButton);
    paginationWrapper.appendChild(nextDiv);
}

function addBtn(btnText, pageNumberWrapper, isSelected, isDots) {
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("pagination_btn__box");
    const btn = document.createElement("button");
    btn.textContent = btnText;
    if (isDots) {
        btn.classList.add("pagination_btn_dots");
    } else {
        if (isSelected) {
            btn.classList.add("pagination_active");
        } else {
            btn.classList.add("pagination_btn");

            btn.onclick = () => {
                currentPage = btnText;
                getProfileList();
            }
        }
    }


    btnWrapper.appendChild(btn);
    pageNumberWrapper.appendChild(btnWrapper);
}

function changeStatus(id, status) {
    if (status === "IN_REGISTRATION") {
        return;
    }


    const lang = document.getElementById("current-lang").textContent;

    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) {
        window.location.href = './login.html';
        return;
    }
    const body = {
        "status": status
    }


    fetch(`http://localhost:8081/profile/status/` + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

function deleteProfile(id) {


    const lang = document.getElementById("current-lang").textContent;

    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) {
        window.location.href = './login.html';
        return;
    }


    fetch(`http://localhost:8081/profile/` + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
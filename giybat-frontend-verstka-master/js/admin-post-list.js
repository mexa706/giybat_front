window.addEventListener("DOMContentLoaded", function () {
    getPostList();
});
let currentPage = 1;
let pageSize = 9;

function getPostList() {

    const jwt = localStorage.getItem('jwtToken');
    const lang = document.getElementById("current-lang").textContent;

    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    let postQuery = document.getElementById("admin_post_list_post_input_id").value;
    let profileQuery = document.getElementById("admin_post_list_profile_input_id").value;

    if (postQuery.length===0||postQuery.trim().length===0) postQuery = null;
    if (profileQuery.length===0||profileQuery.trim().length===0) profileQuery = null;

    const body = {
        "postQuery": postQuery,
        "profileQuery": profileQuery
    }


    fetch(`http://localhost:8081/post/filter?page=${currentPage}&size=${pageSize}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }, body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            showPostList(data.content);
            showPagination(data.totalElements);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function showPostList(postList) {
    const container = document.getElementById("admin_post_list_table_id");
    container.innerHTML = '';

    if (postList.length === 0) {
        return;
    }

    postList.forEach((post, index) => {

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

        if (post.photo && post.photo.url) {
            img.src = post.photo.url;
        } else {
            img.src = "./images/post-default-img.jpg";
        }

        tdImage.appendChild(img);
        tr.appendChild(tdImage);

        // Title
        const tdTitle = document.createElement("td");
        tdTitle.classList.add("td");
        tdTitle.innerHTML = post.title;
        tr.appendChild(tdTitle);

        // Created Date
        const tdDate = document.createElement("td");
        tdDate.classList.add("td");
        tdDate.innerHTML = dateFormat(post.createdDate);
        tr.appendChild(tdDate);

        // Profile
        const tdProfile = document.createElement("td");
        tdProfile.classList.add("td");
        tdProfile.innerHTML = post.profile.name + "<br>" + " (" + post.profile.username + ")";
        tr.appendChild(tdProfile);

        // #
        const tdAction = document.createElement("td");
        tdAction.classList.add("td");

// info
        const infoImg = document.createElement("img");
        infoImg.src = "./images/info.png";
        infoImg.classList.add("table_basket", "hover-pointer");

        infoImg.onclick = function () {
            openPostInfo(post.id);
        };

// delete
        const deleteImg = document.createElement("img");
        deleteImg.src = "./images/basket.svg";
        deleteImg.classList.add("table_basket", "hover-pointer");

        deleteImg.onclick = function () {
            deletePost(post.id);
        };

        tdAction.appendChild(infoImg);
        tdAction.appendChild(deleteImg);

        tr.appendChild(tdAction);

        container.appendChild(tr);
    });
}

function showPagination(totalElements) {
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
            getPostList();
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
            getPostList();
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
                getPostList();
            }
        }
    }


    btnWrapper.appendChild(btn);
    pageNumberWrapper.appendChild(btnWrapper);
}

function deletePost(postId) {


    const lang = document.getElementById("current-lang").textContent;

    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) {
        window.location.href = './login.html';
        return;
    }


    fetch(`http://localhost:8081/post/` + postId, {
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

function openPostInfo(postId) {
    window.open(`./post-detail.html?id=${postId}` ,"_blank");
}







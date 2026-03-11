window.addEventListener("DOMContentLoaded", function () {
    getPostList();
});

let currentPage = 1;

function getPostList() {

    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) {
        window.location.href = './login.html';
        return;
    }

    const lang = document.getElementById("current-lang").textContent;
    let size = 9;

    fetch(`http://localhost:8081/post/profile?page=${currentPage}&size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(response => {
            const contentType = response.headers.get("content-type");

            if (!contentType || !contentType.includes("application/json")) {
                localStorage.removeItem("jwtToken");
                window.location.href = "./login.html";
                return;
            }

            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {
            showPostList(data.content);
            showPagination(data.totalElements, data.size);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showPostList(postList) {
    const parent = document.getElementById("profile_post_container_id")
    parent.innerHTML = '';

    postList.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("position-relative", "post_box");
        //button
        const editButton = document.createElement("a");
        editButton.classList.add("profile_tab_btn")
        editButton.href = "./post-create.html?id=" + post.id;
        //image_div
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("post_img_box");
        //image
        const img = document.createElement("img");

        if (post.photo && post.photo.url) {
            img.src = post.photo.url;
        } else {
            img.src = "./images/post-default-img.jpg";
        }

        img.classList.add("post_img");
        imageDiv.appendChild(img);

        //title
        const title = document.createElement("h3");
        title.classList.add("post_title");
        title.textContent = post.title;

        //created_date
        const created_date = document.createElement("p");
        created_date.classList.add("post_text");
        created_date.textContent = dateFormat(post.createdDate);

        //add to main div
        div.appendChild(created_date);
        div.appendChild(imageDiv);
        div.appendChild(editButton);
        div.appendChild(title);

        parent.appendChild(div);
    })

}

function showPagination(totalElements, size) {
    let totalPageCount = Math.ceil(totalElements / size);
    console.log(totalPageCount);

    const paginationWrapper = document.getElementById("paginationWrapperId");
    paginationWrapper.innerHTML = '';

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





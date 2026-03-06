window.addEventListener("DOMContentLoaded", function () {
    getPostList();
});

let currentPage = 1;

function getPostList() {


    const lang = document.getElementById("current-lang").textContent;
    let size = 10;

    const body = {
        "query": null
    }


    fetch(`http://localhost:8081/post/public/filter?page=${currentPage}&size=${size}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
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
            if (data.content && data.content.length > 1) {
                showMainPost(data.content.shift())
                showPostList(data.content);
                showPagination(data.totalElements, data.size);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function showMainPost(mainPost) {

    const image = document.getElementById("main-card-imageId");
    if (mainPost.photo && mainPost.photo.url) {
        image.src = mainPost.photo.url;
    } else {
        image.src = "./images/post-default-img.jpg";
    }
    document.getElementById("main-card-dateId").textContent = dateFormat(mainPost.createdDate);
    document.getElementById("main-card-titleId").textContent = mainPost.title;
    document.getElementById("main-card-detailBtnId").href = "./post-detail.html?id=" + mainPost.id;

}


function showPostList(postList) {
    const parent = document.getElementById("post_container_id")
    parent.innerHTML = '';

    postList.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("position-relative", "post_box");

        const a = document.createElement("a");
        a.classList.add("profile_tab__btn")
        a.href = "./post-detail.html?id=" + post.id;

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("post_img__box");

        const img = document.createElement("img");

        if (post.photo && post.photo.url) {
            img.src = post.photo.url;
        } else {
            img.src = "./images/post-default-img.jpg";
        }

        img.classList.add("post_img");
        imageDiv.appendChild(img);

        const title = document.createElement("h3");
        title.classList.add("post_title");
        title.textContent = post.title;

        const created_date = document.createElement("p");
        created_date.classList.add("post_text");
        created_date.textContent = dateFormat(post.createdDate);

        a.appendChild(imageDiv);
        a.appendChild(title);
        a.appendChild(created_date);

        div.appendChild(a);

        parent.appendChild(div);
    });
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




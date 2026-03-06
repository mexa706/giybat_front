window.addEventListener("DOMContentLoaded", function () {
    var url_string = window.location.href; // www.test.com?id=dasdasd
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if (id) {
        getPostById(id);
        getPostList(id);
    }
});

function getPostById(postId) {
    const lang = document.getElementById("current-lang").textContent;

    fetch(`http://localhost:8081/post/public/` + postId, {
        method: 'GET',
        headers: {
            'Accept-Language': lang,
        }
    })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.text());
            }
            return response.json();
        })
        .then(data => {


            document.getElementById("postDetailDateId").textContent = dateFormat(data.createdDate);
            document.getElementById("postDetailTitleId").textContent = data.title;

            if (data.photo && data.photo.url) {
                document.getElementById("postDetailImgId").src = data.photo.url;
            } else {
                document.getElementById("postDetailImgId").src = "./images/post-default-img.jpg";
            }

            document.getElementById("postDetailContentId").textContent = data.content;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getPostList(exceptId) {

    const lang = document.getElementById("current-lang").textContent;

    const body = {
        "exceptId": exceptId
    }

    fetch(`http://localhost:8081/post/public/similar`, {
        method: 'POST',
        headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json',
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
            if (data && data.length > 0) {}
            showPostList(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

function showPostList(postList) {
    const parent = document.getElementById("similar-post-container-id")
    parent.innerHTML = '';
    postList.forEach(postItem => {
        //
        const div = document.createElement("div");
        div.classList.add("post_box");
        // button
        const a = document.createElement("a");
        // editButton.classList.add("profile_tab_btn");
        a.href = "./post-detail.html?id=" + postItem.id;

        // image_div
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("post_img__box");
        // image
        const img = document.createElement("img");
        if (postItem.photo && postItem.photo.id) {
            img.src = postItem.photo.url;
        } else {
            img.src = './images/post-default-img.jpg';
        }
        img.classList.add('post_img');
        imageDiv.appendChild(img);

        // title
        const title = document.createElement("h3");
        title.classList.add("post_title");
        title.textContent = postItem.title

        // created_date
        const createdDate = document.createElement("p");
        createdDate.classList.add("post_text");
        createdDate.textContent = dateFormat(postItem.createdDate);

        // add elements to a
        a.appendChild(imageDiv)
        a.appendChild(title);
        a.appendChild(createdDate);
        // add elements to main div
        div.appendChild(a);
        //
        parent.appendChild(div);
    });


}



async function fetch_users() {
    const response = await fetch('https://dummyjson.com/users?limit=100');
    const users = await response.json();
    const users_array = users.users;
    return users_array; 
}

async function fetch_user_posts(user_id) {
const response = await fetch('https://dummyjson.com/users/'+ user_id + '/posts');
const posts = await response.json();
const posts_array = posts.posts;
return posts_array;
}

async function show_user_info() {

// get username from the url
const url_parameter = new URLSearchParams(window.location.search);
const username = url_parameter.get('username');

const users = await fetch_users();
let found_user = {};

for (const user of users) {
    if (user.username === username) {
        found_user = user;
        break;
    }
}

// dynamically loading content to the page
const user_box = document.createElement("div");
user_box.classList.add("user-box");

const img  = document.createElement("img");
img.src = found_user.image;
img.alt = "user image";

const info_box = document.createElement("div");
info_box.classList.add("info-box");

const name = document.createElement("p");
name.classList.add('name');
name.textContent = found_user.firstName + " " + found_user.lastName;

const address = document.createElement("p");
address.classList.add('name');
address.textContent = found_user.address.city + ", " + found_user.address.state;

const email = document.createElement("p");
email.classList.add('email');
email.textContent = found_user.email;

user_box.appendChild(img);

info_box.appendChild(name);
info_box.appendChild(address);
info_box.appendChild(email);

user_box.appendChild(info_box);

const location = document.querySelector('.container');
location.appendChild(user_box);

const posts = await fetch_user_posts(found_user.id);

const header = document.createElement("h1");
header.textContent = `Posts by ${found_user.username}.`;
header.classList.add('posts-header');
location.appendChild(header);

for (const post of posts) {
    const post_title = document.createElement("h1");
    post_title.classList.add('post-title');
    post_title.textContent = post.title;

    const post_body = document.createElement("p");
    post_body.classList.add('post-body');
    post_body.textContent = post.body;

    location.appendChild(post_title);
    location.appendChild(post_body);

}
}

show_user_info();

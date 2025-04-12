
async function fetch_users() {
    const response = await fetch('https://dummyjson.com/users?select=id,firstName,lastName,username,image&limit=100');
    const users = await response.json();
    const users_array = users.users;
    return users_array; 
}


async function fetch_posts() {
    const response = await fetch('https://dummyjson.com/posts?limit=100');
    const posts = await response.json();
    const posts_array = posts.posts;
    return posts_array;
}


function create_post_template(post, users) {

    // Structure to contain the post
    const post_block = document.createElement("div");
    post_block.classList.add("post-block");

    // Box 1 holds post image
    const post_box_one = document.createElement("div");
    post_box_one.classList.add("postbox-1");

    const img  = document.createElement("img");
    const img_paths = ['images/room-carved-wood.jpeg', 'images/blue-and-white.jpg', 'images/rounded-lights.jpeg', 'images/waved-wood.jpeg', 'images/white-room.jpeg']
    const random_index = Math.floor(Math.random()*5);
    img.src = img_paths[random_index];
    img.alt = "post image";

    post_box_one.appendChild(img);
    post_block.appendChild(post_box_one);

    // Box 2 hold post text
    const post_box_two = document.createElement("div");
    post_box_two.classList.add("postbox-2");

    const link = document.createElement("p");
    link.id = "user-";
    link.classList.add('username');
    link.textContent = users[post.userId-1].username;

    const header = document.createElement("h3");
    header.id = "title-";
    header.textContent = post.title;

    const paragraph = document.createElement("p");
    paragraph.id = "post-";
    paragraph.textContent = post.body;

    post_box_two.appendChild(link);
    post_box_two.appendChild(header);
    post_box_two.appendChild(paragraph);
    post_block.appendChild(post_box_two);

    return post_block;
}


function create_comment_template(comments) {

    // Container structure for all post-related comments
    const comment_container = document.createElement("div");
    comment_container.classList.add("comments");

    // Create the specific amount of comment lines for each post
    for (const com in comments) {

        const username = document.createElement("p");
        username.classList.add("username-");
        username.textContent = comments[com].user.username;

        const comment = document.createElement("p");
        comment.classList.add("com-");
        comment.textContent = comments[com].body;

        comment_container.appendChild(username);
        comment_container.appendChild(comment);
    }

    return comment_container;
}


let current_page = 1;
const posts_per_page = 5;


async function display_posts(page) {

    const start_index = (page - 1) * posts_per_page;
    const end_index = start_index + posts_per_page;

    const posts = await fetch_posts();
    const posts_to_display = posts.slice(start_index, end_index);
    

    const container = document.getElementById('post-container');

    for (const post of posts_to_display) {

        try {

            const user_array = await fetch_users();
            const post_container = create_post_template(post, user_array);

            const response = await fetch('https://dummyjson.com/posts/' + post.id + '/comments');
            const comments = await response.json();
            const comments_array = comments.comments;

            const comment_container = create_comment_template(comments_array);


            const location = document.querySelector('.post-container');
            location.appendChild(post_container);
            location.appendChild(comment_container);

            // open user page for specific clicked user
            const user_links = document.querySelectorAll('.username');

            user_links.forEach(user_link => {

                user_link.addEventListener('click', function(event) {

                    const clicked_username = event.target.textContent;
                    console.log('Clicked username:', clicked_username);

                    window.location.href = `user.html?username=${clicked_username}`;
                });
            });


        } catch (error) {
            console.error('An error occurred:', error);
        }
        

    }
}

function setup_infinite_scroll() {

    let timeout; // Identifier for the debounce timeout
    let buffer = 200; // Adjusted buffer to account for dynamic content height

    window.onscroll = async () => {

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
        
            let scrollPosition = window.innerHeight + window.scrollY;
            let adjustedOffsetHeight = Math.max(document.body.offsetHeight, buffer);
        
            if (scrollPosition >= adjustedOffsetHeight - buffer) {
                current_page++;
                await display_posts(current_page);
            }

        }, 300);
    };
}

// Initial call to display the first set of items and setup infinite scroll
setup_infinite_scroll();
display_posts(current_page);


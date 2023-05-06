const searchInput = document.getElementById("search");
const count = document.getElementById('result-count');
const usersList = document.getElementById('container');
let userListItem = [];


const updateValue = debounce((e) => {
  const query = e.target.value;
  if (!query) {
    count.textContent = "No users found";
    usersList.innerHTML = "";
    return;
  }

  fetch(`https://api.github.com/search/users?q=${query}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.total_count);
      userListItem = data.items;

      if (!userListItem.length) {
        count.textContent = "No users found";
        usersList.innerHTML = "";
        return;
      }

      let userNames = "";
      for (let user of userListItem) {
        userNames += `
          <div class="card">
            <img src="${user.avatar_url}" alt="Avatar" class="profile-img"/>
            <div class="profile-info">
              <h4 class="profile-login">${user.login}</h4> 
              <a href="${user.html_url}" target="_blank" class="profile-link">Visit profile</a>
            </div>
          </div>     
        `;
      }
      count.textContent = "No. of Users found : " + userListItem.length;
      usersList.innerHTML = userNames;
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      count.textContent = "An error occurred while fetching users";
      usersList.innerHTML = "";
    });
}, 1000);


function debounce(cb, delay = 250) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

searchInput.addEventListener("input", updateValue);

const projectUrl = 'https://nsvbxmhwoncpxmqfsdab.supabase.co';
const projectKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdmJ4bWh3b25jcHhtcWZzZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMjQzOTAsImV4cCI6MjA2ODcwMDM5MH0.mVyqnlyV2cQx3laoXqxvHFpRcAwSsjvHvIbHTc9675A';
const { createClient } = supabase;
const client = createClient(projectUrl, projectKey)

console.log(createClient);
console.log(client);

// signup functionality

const signupBtn = document.getElementById('signupBtn')

signupBtn && signupBtn.addEventListener('click', async () => {
  const full_name = document.getElementById('full_name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const profile_pic = document.getElementById('profile_pic').files[0]
  const fileEx = profile_pic.name.split('.')[1]

  console.log(fileEx);
  console.log(full_name, email, password, profile_pic);

  // authentication 

  if (email && password) {
    try {
      const { data, error: signupError } = await client.auth.signUp({
        email: email,
        password: password,
      })
      console.log(data);
      console.log(signupError);


      // get User 

      const { data: { user }, error
      } = await client.auth.getUser()
      console.log('get user data.........', user);
      console.log(user.id);

      console.log(error);


      if (data) {

        // profile store in bucket 

        const { data, error } = await client.storage.from('users-profiles')
          .upload(`avatars/users-${user.id}.${fileEx}`, profile_pic, {
            upsert: true,
          })
        if (error) {
          console.log(error);

        } else {
          console.log('added a profile in bucket', data);

          const { data: { publicUrl } } = client
            .storage
            .from('users-profiles')
            .getPublicUrl(`avatars/users-${user.id}.${fileEx}`)

          console.log('profile url............=>', publicUrl);

          // other details store in database

          const { error } = await client
            .from('storage')
            .insert({ user_id: user.id, email: email, full_name: full_name, profile_url: publicUrl })

          if (error) {
            console.log(error);
          }
          else {

            window.location.href = "post.html"
          }
        }

      }
    } catch (error) {
      console.log('signup error', error);
    }
  } else {
    if (email) {
      alert('please fill password feild')
    }
    else {
      alert('please fill email feild')
    }
  }

})


// login page

const loginBtn = document.getElementById("loginBtn");
loginBtn &&
  loginBtn.addEventListener("click", async () => {
    const loginEmail = document.getElementById("login-email").value;
    const loginPassword = document.getElementById("login-password").value;

    console.log(loginEmail, loginPassword);

    if (loginEmail && loginPassword) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
        if (error) throw error;

        console.log(data);
        if (data) {
          Swal.fire({
            title: "Successfully Logged in! Redirecting to post page...",
            icon: "success",
            draggable: true,
          });
        }
        setInterval(() => {
          window.location.href = "post.html";
        }, 2000);
      } catch (error) {
        console.error("login error: ", error);
        if (error.message.includes("Invalid login credentials")) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid email or password. Please try again.",
          });
        }
      }
    } else {
      if (loginEmail) {
        Swal.fire("please fill the Passsword field.");
      } else {
        Swal.fire("please fill the Email field.");
      }
    }
  });

// profile fetch for post page 

if (window.location.pathname.endsWith('post.html')) {
  const displayProfile = async () => {
    const { data: { user: { id: userId } }, error } = await client.auth.getUser()
    console.log(userId);
    console.log(error);

    if (userId) {
      const { data: [{ full_name, email, profile_url }], error } = await client.from('storage').select().eq('user_id', userId)

      if (profile_url) {
        const avatar = document.getElementById('avatar');
        if (avatar) {
          avatar.src = profile_url;
        }

      } else {
        console.log(error);
      }

    } else {
      console.log('post page error=======>', error);
    }
  }

  displayProfile();
}

// profile fetch for all-blogs page 

if (window.location.pathname.endsWith('all-blogs.html')) {
  const displayProfile = async () => {
    const { data: { user: { id: userId } }, error } = await client.auth.getUser()
    console.log(userId);
    console.log(error);

    if (userId) {
      const { data: [{ full_name, email, profile_url }], error } = await client.from('storage').select().eq('user_id', userId)

      if (profile_url) {
        const avatar = document.getElementById('avatar');
        if (avatar) {
          avatar.src = profile_url;
        }

      } else {
        console.log(error);
      }

    } else {
      console.log('post page error=======>', error);
    }
  }

  displayProfile();
}

// profile fetch for my-blogs page 

if (window.location.pathname.endsWith('my-blogs.html')) {
  const displayProfile = async () => {
    const { data: { user: { id: userId } }, error } = await client.auth.getUser()
    console.log(userId);
    console.log(error);

    if (userId) {
      const { data: [{ full_name, email, profile_url }], error } = await client.from('storage').select().eq('user_id', userId)

      if (profile_url) {
        const avatar = document.getElementById('avatar');
        if (avatar) {
          avatar.src = profile_url;
        }

      } else {
        console.log(error);
      }

    } else {
      console.log('post page error=======>', error);
    }
  }

  displayProfile();
}


// profile fetch for profile page 

if (window.location.pathname.endsWith('profile.html')) {

  const profilepage = async () => {
    const { data: { user: { id: userId } }, error } = await client.auth.getUser()
    console.log(userId);
    console.log(error);

    if (userId) {
      const { data: [{ full_name, email, profile_url }], error } = await client.from('storage').select().eq('user_id', userId)

      if (profile_url) {
        const profile_pic_update = document.getElementById('profile_pic_update');
        profile_pic_update.src = profile_url;
      }
      if (full_name) {
        const fullname_ = document.getElementById('fullname_')
        fullname_.value = full_name;
      }
      if (email) {
        const profile_email = document.getElementById('profile_email')
        profile_email.value = email;
      }
    }
    else {
      console.log('post page error=======>', error);
    }
  }
  profilepage()
}

// profile pic delete

const deletPicture = document.getElementById('deletPicture')
deletPicture && deletPicture.addEventListener('click', async () => {
  const { data: { user }, error: userError } = await client.auth.getUser();
  console.log(user);
  console.log(userError);

  if (user) {
    // Get profile data from Supabase table
    const { data: { profile_url }, error: profileError } = await client
      .from('storage')
      .select('profile_url')
      .eq('user_id', user.id)
      .single();

    if (profile_url) {
      console.log('..............=>', profile_url);

      // Extract file extension from URL
      const urlParts = profile_url.split('.');
      const fileEx = urlParts[3]

      console.log(fileEx);

      const { data: deletedata, error: deleteError } = await client
        .storage
        .from('users-profiles')
        .remove([`avatars/users-${user.id}.${fileEx}`]);
      console.log(deletedata);

      console.log(deleteError);


      if (!deleteError) {
        const { data: [{ full_name, email, profile_url }], error } = await client.from('storage').select().eq('user_id', user.id)
        const profile_pic_update = document.getElementById('profile_pic_update');
        profile_pic_update.src = "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg";

        const { data, error: { updateError } } = await client
          .from('storage')
          .update({ profile_url: "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg" })
          .eq('user_id', user.id);
        console.log(data);
        console.log(updateError);
      }

    } else {
      console.log('Profile URL not found', profileError);
    }
  }
});

const saveBtn = document.getElementById('saveBtn')
saveBtn && saveBtn.addEventListener('click', async () => {

  const fullname_ = document.getElementById('fullname_').value
  const profile_email = document.getElementById('profile_email').value

  const { data: { user }, error: userError
  } = await client.auth.getUser()
  console.log('get user data.........', user);
  console.log(user.id);
  console.log(userError);

  const { data, error } = await client
    .from('storage')
    .update({ full_name: fullname_, email: profile_email })
    .eq('user_id', user.id);
  console.log(data);
  console.log(error);

  window.location.href = 'post.html'
})

// update picture 

const chanagePicture = document.getElementById('chanagePicture')
chanagePicture && chanagePicture.addEventListener('click', async () => {


  const closeIcon = document.getElementById("closeIcon");
  const cancelBtn = document.getElementById("cancelBtn");
  const modal = document.getElementById("myModal");

  closeIcon.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  function openModal() {
    document.getElementById("myModal").style.display = "flex";
  }
  openModal()

  const update_picSav = document.getElementById('update-picSav')

  update_picSav && update_picSav.addEventListener('click', () => {

    const newpicUpload = document.getElementById('newpicUpload').files[0]
    console.log(newpicUpload);


    const preveiw = URL.createObjectURL(newpicUpload)
    const profile_pic_update = document.getElementById('profile_pic_update');
    profile_pic_update.src = preveiw

    modal.style.display = 'none'



    const updateProfile = async () => {

      const { data: { user }, error: userError } = await client.auth.getUser();
      console.log(user);
      console.log(userError);

      const newpicUpload = document.getElementById('newpicUpload').files[0]
      console.log(newpicUpload);

      const newFileEx = newpicUpload.name.split('.')[1]
      console.log(newFileEx);

      const { data: uploadData, error } = await client
        .storage
        .from('users-profiles')
        .upload(`avatars/users-${user.id}.${newFileEx}`, newpicUpload, {
          upsert: true
        })

      console.log('profile update data.......=> ', uploadData);
      console.log(error);

      const { data: { publicUrl } } = client
        .storage
        .from('users-profiles')
        .getPublicUrl(`avatars/users-${user.id}.${newFileEx}`)

      console.log('profile url............=>', publicUrl);

      const uniqueUrl = `${publicUrl}?t=${Date.now()}`;
      console.log('Unique profile url............=>', uniqueUrl);

      const { data, error: updateURLERROR } = await client
        .from('storage')
        .update({ profile_url: uniqueUrl })
        .eq('user_id', user.id);
      console.log(data);
      console.log(updateURLERROR);
    }

    updateProfile()

  });

})


// logout functionality

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn &&
  logoutBtn.addEventListener("click", async () => {
    try {
      const { error } = await client.auth.signOut();
      window.location.href = "index.html";
      if (error) throw error;
    } catch (error) {
      console.log("logout error", error);
      alert("Logout Failed.");
    }
  });


// add post functionality

const submitPost = document.getElementById("submitPost");
const loaderOverlay = document.getElementById("loader-overlay");

function showLoader() {
  loaderOverlay.style.display = "flex";
}

function hideLoader() {
  loaderOverlay.style.display = "none";
}

submitPost &&
  submitPost.addEventListener("click", async () => {
    const {
      data: { user },
    } = await client.auth.getUser();
    const postTitle = document.getElementById("post-title").value.trim();
    const postdescrib = document.getElementById("postdescrib").value.trim();

    if (!postTitle || !postdescrib) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both a title and a description.",
        confirmButtonColor: "#125b9a",
      });
      return;
    }
    showLoader();
    submitPost.disable = true;

    try {
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user) throw authError || new Error("user not found.");

      const { data, error } = await client
        .from("users information")
        .insert([
          {
            user_id: user.id,
            title: postTitle,
            description: postdescrib,
          },
        ])
        .select();

      if (error) {
        console.error(error.message);
        Swal.fire({
          icon: "error",
          title: "Post Failed",
          text: "There was a problem creating the post.",
          confirmButtonColor: "#125b9a",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Post Created",
          text: "Your post has been successfully created!",
          timer: 1500,
          showConfirmButton: false,
        });

        document.getElementById("post-title").value = "";
        document.getElementById("postdescrib").value = "";
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#125b9a",
      });
    } finally {
      hideLoader();
      submitPost.disable = "false";
    }
  });

// read all posts

if (window.location.pathname.includes("all-blogs.html")) {

  try {
    const readAllPosts = async () => {

  const { data, error } = await client
  .from("users information")
  .select(`
    user_id,
    title,
    description,
    storage:storage!inner (
       profile_url,
      email,
      full_name
    )
  `);

if (error) {
  console.error("Error fetching posts:", error);
} else {
  console.log("Posts with profile:", data);


      const readPostBox = document.getElementById('readPostBox')
      console.log(readPostBox);
      readPostBox.innerHTML = data.map(({ id, title, description, storage }) => `
  <div class="card bg-white border-danger mt-3 container justify-content-center align-items-start" id='${id}'" style="width: 40rem; height:auto;">
  <div class="card-body py-3 px-0">
  <div class="user-profile">
                  <img
                    id="profile-avatar"
                    src="${storage?.profile_url || 'default.jpg'}"
                    alt="Profile Picture"
                    class="avatar"
                  />
                  <div class="user-details">
                    <h3 id="profile-name" class="text-black" style="font-family:'myFont';">${storage?.full_name || 'Unknown User'}</h3>
                    <p id="profile-email" class="text-black" style="font-family:'myFont';">${storage?.email || 'abc@gmail.com'}</p>
                  </div>
                </div>
                 <hr/>
    <h5 class="card-title " style="font-family:'myFont'; font-size: 25px;">${title}</h5>
    <p class="card-text" style="font-family:'Libertinus Serif';">${description}</p>  
    <hr/>
    <div class="d-flex " style="font-family:'myFont';">
   <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-thumbs-up pe-2" style="color: #000000ff;"></i> Like </button>
   <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-comment fa-flip-horizontal ps-2" style="color: #000000ff;"></i> Comment </button>
   <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-share pe-2" style="color: #000000ff;"></i> share </button>
   <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-bookmark pe-2" style="color: #000000ff;"></i> Save </button>
    </div>
  </div>
</div>`)
        .join("");
}
}

    readAllPosts();
  }
  catch (error) {
    console.log(error);
  }
  }


// read my posts 

const readMyPosts = async () => {
  const { data: { user } } = await client.auth.getUser();

  // const { data, error } = await client
  //   .from('users information')
  //   .select()
  //   .eq('users_id', user.id);


  const { data, error } = await client
    .from('users information')
   .select(`
     id,
    user_id,
    title,
    description,
    storage:storage!inner (
       profile_url,
      email,
      full_name
    )
  `)
    .eq('user_id', user.id);

  if (data) {
    console.log(data);

    const readMyPostBox = document.getElementById('readMyPostBox');

    readMyPostBox.innerHTML = data.map(({ id, title, description, storage}) => {
      // Correctly encode JSON and escape it for HTML
      const postData = JSON.stringify({ title, description })
        .replace(/"/g, "&quot;"); // Escape quotes

      return `
<div class="card bg-white border-danger  mt-3 container justify-content-center align-items-start" style="width: 40rem; height:auto; overflow-X:hidden;">
  <div class="card-body py-3 px-0">
    <div class="user-profile">
      <img
        src="${storage?.profile_url || 'default.jpg'}"
        alt="Profile Picture"
        class="avatar"
      />
      <div class="user-details">
        <h3 class="text-black" style="font-family:'myFont';">${storage?.full_name || 'Unknown User'}</h3>
        <p class="text-black" style="font-family:'myFont';">${storage?.email || 'abc123@gmai.com'}</p>
      </div>
    </div>

    <h5 class="card-title mt-4" style="font-family:'myFont'; font-size: 25px;">${title}</h5>
    <p class="card-text" style="font-family:'Libertinus Serif';">${description}</p>
  </div>
  <hr style="width:490px; border: 1px solid black; margin-left: 12px; margin-top:2px; margin-bottom:4px;">

  <div class="d-flex" style="font-family:'myFont';">
    <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-thumbs-up pe-2"></i> Like</button>
    <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-comment fa-flip-horizontal ps-2"></i> Comment</button>
    <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-share pe-2"></i> Share</button>
    <button class="px-3 py-1 ms-3 bg-transparent border-0 rounded-2 hover"><i class="fa-solid fa-bookmark pe-2"></i> Save</button>
  </div>

  <hr style="width:490px; border: 1px solid black; margin-left: 12px; margin-top:8px; margin-bottom:4px;">
  <div class="d-flex justify-content-center pb-3 mt-2 gap-2">
 <button 
          type="button"
          class="btn ms-2 btn-outline-danger edit-post-btn"
          data-id="${id}"
          data-post="${postData}"
        >
          Edit post
        </button>
    <button class="btn btn-outline-danger delete-post-btn" data-id="${id}">Delete post</button>
  </div>
</div>`;
    }).join("");

    // edit button listeners
    document.querySelectorAll('.edit-post-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const raw = button.dataset.post.replace(/&quot;/g, '"');
        const post = JSON.parse(raw);

        editPost(id, post.title, post.description);
      });
    });

    // 👇 Delete button listeners
    document.querySelectorAll('.delete-post-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deletePost(id);
      });
    });
  } else {
    console.log(error);
  }
};


if (window.location.pathname.includes('my-blogs.html')) {
  readMyPosts()
}

// delete posts

async function deletePost(postId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await client
          .from('users information')
          .delete()
          .eq('id', postId)
        if (response) {
          console.log(response);
          readMyPosts();
        }
        else {
          console.log(error);
        }
      }
      catch (error) {
        console.log(error);
      }
      swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        icon: "error"
      });
    }
  });
}

// edit post

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;") // escape "
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function editPost(postid, posttitle, postdescribtion) {
  console.log(postid, posttitle, postdescribtion);
  const title = escapeHtml(decodeURIComponent(posttitle));
  const description = escapeHtml(decodeURIComponent(postdescribtion));

  const { value: formValues } = await Swal.fire({
    title: "Update Post",
    html: `
     
<div class="d-flex mt-3 flex-column flex-md-row align-items-start align-items-md-center gap-2">
  <label style="min-width: 100px;"><strong>Title</strong></label>
  <input id="swal-input1" class="swal2-input mt-0 " value="${title}">
</div>

<div class="d-flex mt-3 flex-column flex-md-row align-items-start align-items-md-center  gap-2">
  <label class="ps-3" style="min-width: 100px;"><strong >Description</strong></label>
  <input id="swal-input2" class="swal2-input mt-0" value="${description}">
</div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
      ];
    },
  });

  try {
    if (formValues) {
      showLoader();
      const [newTitle, newDescription] = formValues;

      const { error } = await client
        .from("users information")
        .update({ title: newTitle, description: newDescription })
        .eq("id", postid);

      if (error) {
        console.log(error);
      } else {
        hideLoader();
        Swal.fire({
          title: "Your post has been updated.",
          icon: "success",
        });
        readMyPosts();
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
}







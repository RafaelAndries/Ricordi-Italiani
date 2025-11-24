const API_ROOT = "http://localhost:3001/comments";

async function get_comments() {
  const r = await fetch(API_ROOT);
  if (!r.ok) return [];
  return r.json();
  preventDefault();
}
async function post_comment(data) {
  const r = await fetch(API_ROOT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) return null;
  return r.json();
}
async function edit_comment(id, data) {
  const r = await fetch(`${API_ROOT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) return null;
  return r.json();
}
async function delete_comment(id) {
  await fetch(`${API_ROOT}/${id}`, { method: "DELETE" });
}
function setupNav() {
  const nav = document.getElementById("primary-nav");
  const btn = document.getElementById("navToggle");
  if (!nav || !btn) return;
  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}
let comments = [];

function show_comments() {
  const list = document.getElementById("commentsList");
  if (!list) return;
  list.innerHTML = "";

  comments.forEach((item) => {
    const card = document.createElement("div");
    card.className = "comment-card";
    card.dataset.id = item.id;

    const titleElement = document.createElement("h4");
    titleElement.textContent = item.title;

    const bodyElement = document.createElement("div");
    bodyElement.className = "body c-body";
    bodyElement.textContent = item.body;

    const actionsElement = document.createElement("div");
    actionsElement.className = "actions c-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", async () => {
      const newBody = prompt("Edit comment:", item.body);
      if (newBody == null) return;
      const updated = await edit_comment(item.id, { body: newBody });
      if (updated) {
        item.body = updated.body;
        show_comments();
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await delete_comment(item.id);
      comments = comments.filter((x) => x.id !== item.id);
      show_comments();
    });

    actionsElement.append(editButton, deleteButton);
    card.append(titleElement, bodyElement, actionsElement);
    list.appendChild(card);
  });
  preventDefault();
}

async function setup_comments() {
  comments = await get_comments();
  show_comments();

  const form = document.getElementById("commentForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value;
    const title = document.getElementById("cTitle").value;
    const body = document.getElementById("cBody").value;
    if (!name || !title || !body) return;

    const created = await post_comment({ name, title, body });
    if (created) {
      comments.push(created);
      document.getElementById("cName").value = "";
      document.getElementById("cTitle").value = "";
      document.getElementById("cBody").value = "";
      show_comments();
      preventDefault();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await setup_comments();
  setupNav();
});

/* For future i need to fix the long comment overflow */

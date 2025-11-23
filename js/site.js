const API_ROOT = "http://localhost:3001/comments";

async function get_comments() {
  const r = await fetch(API_ROOT);
  if (!r.ok) return [];
  return r.json();
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

  if (!comments.length) {
    const p = document.createElement("p");
    p.textContent = "No comments yet.";
    list.appendChild(p);
    return;
  }

  comments.forEach((item) => {
    const card = document.createElement("div");
    card.className = "comment-card";
    card.dataset.id = item.id;

    const titleEl = document.createElement("h4");
    titleEl.textContent = item.title;

    const metaEl = document.createElement("div");
    metaEl.className = "meta c-meta";
    metaEl.textContent = `by ${item.name}`;

    const bodyEl = document.createElement("div");
    bodyEl.className = "body c-body";
    bodyEl.textContent = item.body;

    const actionsEl = document.createElement("div");
    actionsEl.className = "actions c-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => {
      const newBody = prompt("Edit comment:", item.body);
      if (newBody == null) return;
      const updated = await edit_comment(item.id, { body: newBody.trim() });
      if (updated) {
        item.body = updated.body;
        show_comments();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      const ok = confirm("Delete this comment?");
      if (!ok) return;
      await delete_comment(item.id);
      comments = comments.filter((x) => x.id !== item.id);
      show_comments();
    });

    actionsEl.append(editBtn, deleteBtn);
    card.append(titleEl, metaEl, bodyEl, actionsEl);
    list.appendChild(card);
  });
}

async function setup_comments() {
  comments = await get_comments();
  show_comments();

  const form = document.getElementById("commentForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value.trim();
    const title = document.getElementById("cTitle").value.trim();
    const body = document.getElementById("cBody").value.trim();
    if (!name || !title || !body) return;

    const created = await post_comment({ name, title, body });
    if (created) {
      comments.push(created);
      document.getElementById("cName").value = "";
      document.getElementById("cTitle").value = "";
      document.getElementById("cBody").value = "";
      show_comments();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupNav();
  await setup_comments();
});

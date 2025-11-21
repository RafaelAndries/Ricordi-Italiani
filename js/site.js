const API_ROOT = "http://localhost:3001/comments";
async function get_comments() {
  const res = await fetch(API_ROOT);
  return res.ok ? res.json() : [];
}
async function post_comments(data) {
  const res = await fetch(API_ROOT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok ? res.json() : null;
}
async function update_comments(id, data) {
  const res = await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok ? res.json() : null;
}
async function delete_comments(id) {
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
  comments.forEach((c) => {
    const card = document.createElement("div");
    card.className = "comment-card";
    card.dataset.id = c.id;

    const titleEl = document.createElement("h4");
    titleEl.textContent = c.title;
    card.appendChild(titleEl);

    const metaEl = document.createElement("div");
    metaEl.className = "c-meta";
    metaEl.textContent = `by ${c.name}`;
    card.appendChild(metaEl);

    const bodyEl = document.createElement("div");
    bodyEl.className = "c-body";
    bodyEl.textContent = c.body;
    card.appendChild(bodyEl);

    const actionsEl = document.createElement("div");
    actionsEl.className = "c-actions";
    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    editBtn.textContent = "Edit";
    const delBtn = document.createElement("button");
    delBtn.className = "delete";
    delBtn.textContent = "Delete";
    actionsEl.append(editBtn, delBtn);
    card.appendChild(actionsEl);

    delBtn.addEventListener("click", async () => {
      await delete_comments(c.id);
      comments = comments.filter((x) => x.id !== c.id);
      show_comments();
    });
    editBtn.addEventListener("click", () => beginEdit(card, c));

    list.appendChild(card);
  });
}

function beginEdit(card, c) {
  if (card.classList.contains("comment-editing")) return;
  card.classList.add("comment-editing");
  const bodyEl = card.querySelector(".c-body");
  const actions = card.querySelector(".c-actions");
  const textarea = document.createElement("textarea");
  textarea.value = c.body;
  textarea.rows = 4;
  bodyEl.replaceWith(textarea);
  actions.innerHTML = "";
  const save = document.createElement("button");
  save.textContent = "Save";
  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  actions.append(save, cancel);
  save.addEventListener("click", async () => {
    const newBody = textarea.value.trim();
    await update_comments(c.id, {
      name: c.name,
      title: c.title,
      body: newBody,
    });
    c.body = newBody;
    card.classList.remove("comment-editing");
    show_comments();
  });
  cancel.addEventListener("click", () => {
    card.classList.remove("comment-editing");
    renderComments();
  });
}

async function setupComments() {
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
    const created = await post_comments({ name, title, body });
    if (created) {
      comments.push(created);
      document.getElementById("cBody").value = "";
      show_comments();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupNav();
  await setupComments();
});

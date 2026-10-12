/* --- Tema claro/escuro --- */
const root = document.documentElement;
document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});


/* --- Animação ao rolar --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


/* --- Filtro de projetos --- */
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const cat = btn.dataset.filter;
        projects.forEach((p) => {
            const match = cat === "all" || p.dataset.cat.split(" ").includes(cat);
            p.classList.toggle("is-hidden", !match);
            p.classList.toggle("project-wide", match && cat === "all" && p.dataset.wide !== undefined);
        });
    });
});
// guarda quem é o card largo para restaurar ao voltar em "Todos"
document.querySelectorAll(".project-wide").forEach((p) => (p.dataset.wide = ""));


/* --- Repositórios recentes (API pública do GitHub) --- */
// já exibidos nos cards (ou ocultados de propósito, como o Whoop-extrator)
const skip = new Set([
    "Whoop-extrator", "Projeto_Academico_IA_20262", "Projeto_Academico_BD2_2026.2",
    "gestos-arduino-python", "organizador-arquivo-python", "analisador-temporada-futebol",
    "HenriqueLopes741",
]);

async function loadRepos() {
    const list = document.getElementById("repo-list");
    try {
        const res = await fetch("https://api.github.com/users/HenriqueLopes741/repos?sort=pushed&per_page=30");
        if (!res.ok) throw new Error(res.status);
        const repos = (await res.json())
            .filter((r) => !skip.has(r.name))
            .slice(0, 6);

        list.innerHTML = "";
        repos.forEach((r) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = r.html_url;
            a.target = "_blank";
            a.rel = "noopener";

            const name = document.createElement("span");
            name.className = "repo-name";
            name.textContent = r.name + (r.fork ? " (fork)" : "");
            const desc = document.createElement("span");
            desc.className = "repo-desc";
            desc.textContent = r.description || "";
            const lang = document.createElement("span");
            lang.className = "repo-lang";
            lang.textContent = r.language || "";

            a.append(name, desc, lang);
            li.append(a);
            list.append(li);
        });
    } catch (e) {
        list.closest(".more-repos").hidden = true;
    }
}
loadRepos();

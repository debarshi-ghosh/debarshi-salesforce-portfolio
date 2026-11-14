(() => {
  "use strict";

  const OWNER = "debarshi-ghosh";
  const REPO = "sfdc-essentials";
  const API_TREE = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/git/trees/main?recursive=1";
  const RAW_BASE = "https://raw.githubusercontent.com/" + OWNER + "/" + REPO + "/main/";

  function cleanMarkdown(value) {
    return value
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]*>/g, " ")
      .replace(/[*_~#>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function readSummary(markdown, folder) {
    const lines = markdown.split(/\r?\n/);
    const heading = lines.find(line => /^#\s+/.test(line));
    let paragraph = "";
    if (heading) {
      const start = lines.indexOf(heading) + 1;
      for (let i = start; i < lines.length; i += 1) {
        const line = lines[i].trim();
        if (!line) {
          if (paragraph) break;
          continue;
        }
        if (/^(#{1,6}\s|[-*+]\s|\d+\.\s|!\[|<|\|)/.test(line)) {
          if (paragraph) break;
          continue;
        }
        paragraph = line;
        break;
      }
    }
    return {
      title: heading ? cleanMarkdown(heading.replace(/^#\s+/, "")) : folder,
      description: cleanMarkdown(paragraph) || "Open the project folder for source code, configuration and implementation guidance."
    };
  }

  function createLink(label, href) {
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  async function renderProjects(grid) {
    if (grid.dataset.refreshStarted === "true") return;
    grid.dataset.refreshStarted = "true";
    const status = document.getElementById(grid.dataset.status || "");
    const repositoryUrl = "https://github.com/" + OWNER + "/" + REPO;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(API_TREE, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("GitHub returned HTTP " + response.status);
      const data = await response.json();
      if (data.truncated) throw new Error("GitHub returned a truncated repository listing.");

      const folders = [...new Set((data.tree || [])
        .filter(item => item.type === "blob" && /^[^/]+\/sfdx-project\.json$/.test(item.path))
        .map(item => item.path.split("/")[0]))].sort((a, b) => a.localeCompare(b));

      const projects = await Promise.all(folders.map(async folder => {
        const readmeUrl = RAW_BASE + encodeURIComponent(folder) + "/README.md";
        let details = { title: folder, description: "Open the project folder for source code, configuration and implementation guidance." };
        try {
          const readmeResponse = await fetch(readmeUrl, { cache: "no-store", signal: controller.signal });
          if (readmeResponse.ok) details = readSummary(await readmeResponse.text(), folder);
        } catch (_) {
          // Keep the project visible even if its README cannot be fetched.
        }
        return { folder, ...details };
      }));

      grid.replaceChildren();
      if (!projects.length) {
        const empty = document.createElement("p");
        empty.className = "note";
        empty.textContent = "No Salesforce DX projects were detected. Add a top-level project folder containing sfdx-project.json and README.md.";
        grid.appendChild(empty);
      } else {
        projects.forEach(project => {
          const article = document.createElement("article");
          article.className = "project-card open-source-project-card";
          const body = document.createElement("div");
          body.className = "project-card-body";
          const pill = document.createElement("span");
          pill.className = "pill";
          pill.textContent = "Reusable Salesforce DX project";
          const title = document.createElement("h3");
          title.textContent = project.title;
          const description = document.createElement("p");
          description.textContent = project.description;
          const folderPath = project.folder.split("/").map(encodeURIComponent).join("/");
          body.append(
            pill,
            title,
            description,
            createLink("Explore source code ↗", repositoryUrl + "/tree/main/" + folderPath),
            createLink("Read setup guide ↗", repositoryUrl + "/blob/main/" + folderPath + "/README.md")
          );
          article.appendChild(body);
          grid.appendChild(article);
        });
      }

      if (status) {
        status.textContent = projects.length + " Salesforce DX project" + (projects.length === 1 ? "" : "s") +
          " loaded from the repository's main branch.";
      }
    } catch (error) {
      // Intentionally preserve the static cards so the section remains useful offline or during API failures.
      if (status) {
        status.textContent = "Showing the available project list. Live refresh was unavailable this time; use the repository link for the latest updates.";
      }
      console.warn("SFDC Essentials project refresh failed:", error);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function init() {
    document.querySelectorAll("[data-open-source-projects]").forEach(renderProjects);
  }

  // This script is loaded at the end of each page. Handle both normal and delayed loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
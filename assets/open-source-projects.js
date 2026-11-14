(() => {
  const OWNER = "debarshi-ghosh";
  const REPO = "sfdc-essentials";
  const API_TREE = \`https://api.github.com/repos/\${OWNER}/\${REPO}/git/trees/main?recursive=1\`;
  const RAW_BASE = \`https://raw.githubusercontent.com/\${OWNER}/\${REPO}/main/\`;

  function cleanMarkdown(value) {
    return value
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]*>/g, " ")
      .replace(/[*_~\x60#>]/g, "")
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
    const status = document.getElementById(grid.dataset.status || "");
    const repositoryUrl = \`https://github.com/\${OWNER}/\${REPO}\`;
    try {
      const response = await fetch(API_TREE, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error(\`GitHub returned HTTP \${response.status}\`);
      const data = await response.json();
      if (data.truncated) throw new Error("The repository file listing was truncated.");

      const folders = [...new Set((data.tree || [])
        .filter(item => item.type === "blob" && /^[^/]+\/sfdx-project\.json$/.test(item.path))
        .map(item => item.path.split("/")[0]))].sort((a, b) => a.localeCompare(b));

      const projects = await Promise.all(folders.map(async folder => {
        const readmeUrl = RAW_BASE + encodeURIComponent(folder) + "/README.md";
        let details = { title: folder, description: "Open the project folder for source code, configuration and implementation guidance." };
        try {
          const readmeResponse = await fetch(readmeUrl, { cache: "no-store" });
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
        empty.textContent = "No Salesforce DX projects were detected yet. Add a top-level project folder containing sfdx-project.json to have it listed here.";
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
          const folderUrl = repositoryUrl + "/tree/main/" + encodeURIComponent(project.folder);
          const readmeUrl = repositoryUrl + "/blob/main/" + encodeURIComponent(project.folder) + "/README.md";
          body.append(pill, title, description,
            createLink("Explore source code ↗", folderUrl),
            createLink("Read setup guide ↗", readmeUrl));
          article.appendChild(body);
          grid.appendChild(article);
        });
      }
      if (status) {
        status.textContent = \`\${projects.length} Salesforce DX project\${projects.length === 1 ? "" : "s"} detected from the repository's main branch. This list refreshes when the page is opened.\`;
      }
    } catch (error) {
      grid.replaceChildren();
      const message = document.createElement("p");
      message.className = "note";
      message.textContent = "The live project list could not be loaded just now. Browse the public repository directly for the latest source code.";
      grid.appendChild(message);
      if (status) status.textContent = error.message;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-open-source-projects]").forEach(renderProjects);
  });
})();
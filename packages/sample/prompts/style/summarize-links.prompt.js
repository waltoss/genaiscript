prompt({
    title: "Summarize links",
    description: "Expands contents from links and summarizes them",
    replaces: "nothing",
})

$`You are a export technical writer. Summarize the files below.`

// defFiles(env.links.filter(f => f.filename.endsWith(".md")))
defFiles(env.links)

$`Answer in markdown.`

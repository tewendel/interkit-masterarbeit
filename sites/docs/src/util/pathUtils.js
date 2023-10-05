export const getCurrentSection = (path) => {
    const pathParts = path.split("/")
    if(pathParts?.length)
        return "/" + pathParts[1]
    else 
        return null
}

export const getSection = (path, items) => {
    if(path && items) {
        const currentSection = getCurrentSection(path)
        if(currentSection) {
            const section = items.find(i => i.path == currentSection)
            return section
        }
    }
    return null
}
 
export const getSectionItems = (path, items) => {
    const section = getSection(path, items)
    if(section) {
        return section?.items
    }
    return []
}



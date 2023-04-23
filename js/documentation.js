const documentation = {
    categories:[],
    documents:{}
}
function main(){
    fetchDox(location.href.includes("?"))
}
async function fetchDox(page){
    let response = await fetch(`${location.href.replace("/documentation.html","").replace(/\?.*/,"")}/documentation/doclists.json`);
    let json = await response.json();
    let list = json.documents;
    documentation.categories = json.categories
    for(var i=0; i<list.length; i++){
        response = await fetch(`${location.href.replace("/documentation.html","").replace(/\?.*/,"")}/documentation/${list[i]}.json`)
        json = await response.json();
        documentation.documents[list[i]] = json;
    }
    
    $("homeloadwheel").id.hidden = true
    if(!page)
    loadHomeTOC()

}
function $(name,parent){
    return parent?{
        class:parent.getElementsByClassName(name),
        tag:parent.getElementsByTagName(name)
    }:{
        class:document.getElementsByClassName(name),
        tag:document.getElementsByTagName(name),
        id:document.getElementById(name)
    }
}
function loadHomeTOC(){
    const TOC = $("TOC")
    for(var i=0; i<documentation.categories.length; i++){
        var topic = document.createElement("li")
        var subtopics = document.createElement("ul")
        var topiclink = document.createElement("a")
        topiclink.href=`?topic=${documentation.categories[i]}`
        topic.appendChild(topiclink)
        topic.appendChild(subtopics)
    }
}
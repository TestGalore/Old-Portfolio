var projects = [{
    description : "Responsive portfolio to store  my current and future projects. Built using HTML, CSS, and Javascript.",
    link : "https://elasticbop.github.io/",
    img : "./images/portfolio.PNG"
}, {
    description : "Responsive visualization of the A-star pathfinding algorithm using the manhattan distance as a metric. Built using HTML, CSS, and Javascript",
    link : "https://elasticbop.github.io/projects/Pathfinding/index.html",
    img : "./images/pathfinding.PNG"        
}, {
    description : "A web app allowing users to take note of information about specific matchups in the game League of Legends. Built using the MERN stack and deployed on Heroku.",
    link : "https://lol-matchup-notes.herokuapp.com/",
    img : "./images/lolmatchupnotes.PNG"        
}
];

//create elements using project data and add to DOM
function addProject(project) {
    var link = document.createElement("a");
    var paragraph = document.createElement("p");
    var img = document.createElement("img");
    var figure = document.createElement("figure");
    var figcaption = document.createElement("figcaption");
    var container = document.createElement("div");

    link.setAttribute("href", project.link);
    link.setAttribute("target", "_blank");
    link.setAttribute("class", "projects-entry-image-cover");
    link.appendChild(document.createTextNode("View"));
    
    paragraph.appendChild(document.createTextNode(project.description));

    img.setAttribute("src", project.img);
    img.setAttribute("alt", "No Image Available");

    container.setAttribute("class", "projects-entry");

    figure.appendChild(img);
	figure.appendChild(link);

    figcaption.appendChild(paragraph);
    figure.appendChild(figcaption);

    container.appendChild(figure);
    document.getElementById("projects-container").appendChild(container);
}

var observer; 
function createObserver(){
    observer = new IntersectionObserver(entries => {
        // Loop over the entries
        entries.forEach(entry => {
            // If the element is visible
            if (entry.isIntersecting) {
            // Add the animation class
                entry.target.classList.add('fade-animation');
            }
        });
    });
    document.querySelectorAll(".projects-entry").forEach((i) => {
        if (i) {
            observer.observe(i);
        }
    });
    observer.observe(document.querySelector('.welcome-intro'));
}

function init() {
	//add projects to view
    projects.forEach( addProject );
    createObserver();
    var cover = document.getElementById("loading-screen");
    var content = document.getElementById("content");
	//remove loading display and reveal content
    cover.style.display = "none";
    content.style.display = "block";
}


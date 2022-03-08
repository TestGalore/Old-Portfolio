
let gInfo = {
    rows: 20,
    cols: 40,
    cellSize: 35,
    startLoc: 0,
    endLoc: 0,
    graph: 0
};

let settings = {
    nodeType: 0,
    algType: 0,
    execNum: 0
};


window.onload = () => {
    setUpHandlers();
    setUpGraphView(gInfo);
    setUpGraph(gInfo);
}

//setup the graph UI
function setUpGraphView(gInfo){
    let rows = gInfo.rows;
    let cols = gInfo.cols;
    let cellSize = gInfo.cellSize;
    let nc = document.getElementById("nc");
    nc.innerHTML = "";

    //calculate the number of column and row cells
    rows = Math.floor(window.innerHeight/cellSize*0.8);
    cols = Math.floor(window.innerWidth/cellSize*0.8);

    //adjust grid layout based on number of cols and rows
    nc.style.gridTemplateColumns = "repeat(" + cols + "," + cellSize + "px)";
    nc.style.gridAutoRows = cellSize + "px";

    //create each cell in the grid
    for(let i = 0; i < rows; i++){
        for( let j = 0; j < cols; j++ ){
            let cell = document.createElement("div");
            cell.setAttribute("id", i + "-" + j);
            cell.setAttribute("class", "cell");
            //th.appendChild(document.createTextNode("pain"));
            cell.addEventListener("mousedown", cellOnClick);
            nc.appendChild(cell);
        }
    }
    gInfo.rows = rows;
    gInfo.cols = cols;
}

//set up the model of the graph
function setUpGraph(gInfo){
    gInfo.graph = new Array(gInfo.rows);
    for(let i = 0; i < gInfo.rows; i++ ){
        gInfo.graph[i] = new Array(gInfo.cols);
        for( let j = 0; j < gInfo.cols; j++ ){
            gInfo.graph[i][j] = 0;
        }
    }
}

//assign handlers to different buttons
function setUpHandlers(){
    document.getElementById("node-select").addEventListener("change", selectOnChange);
    document.getElementById("alg-select").addEventListener("change", selectOnChange);
    document.getElementById("start-button").addEventListener("click", startOnClick);
}

//change the color of the cell on Click
function cellOnClick(e){
    let cellLoc = e.target.id;
    cellLoc = cellLoc.split("-");
    let x = parseInt(cellLoc[0]);
    let y = parseInt(cellLoc[1]);

    pathfindingChangeNode(gInfo, x, y);
    console.log(gInfo.graph);
    //console.log(gInfo.startLoc);
    //console.log(gInfo.endLoc);
}

function selectOnChange(e){
    if(e.target.id == "node-select"){
        settings.nodeType = e.target.options.selectedIndex;
    }
    else if (e.target.id == "alg-select"){
        settings.algType = e.target.options.selectedIndex;
    }
}

function startOnClick(){
    if( settings.execNum > 0){
        endLoc = gInfo.endLoc;
        startLoc = gInfo.startLoc;
        setUpGraphView(gInfo);
        setUpGraph(gInfo);
        changeNode(gInfo, endLoc[0], endLoc[1], "red", 1)
        changeNode(gInfo, startLoc[0], startLoc[1], "green", 0)

    }
    if( gInfo.startLoc == 0 || gInfo.endLoc == 0){
        alert("Set up start and end nodes");
    }
    else{
        settings.execNum++;
        console.log(aStar(gInfo));
    }
}

function pathfindingChangeNode( gInfo, x, y){
    if( settings.nodeType == 0){
        updateStartNode(gInfo, x, y);
        changeNode(gInfo, x, y, "green", settings.nodeType);
    }
    else if( settings.nodeType == 1){
        updateEndNode(gInfo, x, y);
        changeNode(gInfo, x, y, "red", settings.nodeType);
    }
    else{
        changeNode(gInfo, x, y, "black", settings.nodeType);
    }
}

//change the node in both the graph and view at specified location with color and node Type
function changeNode(gInfo, x, y, color, nodeType){
    let cell = document.getElementById(x + "-" + y);
    if( gInfo.graph[x][y] == nodeType+1){
        cell.style.backgroundColor = "";
        gInfo.graph[x][y] = 0;
    }
    else if( gInfo.graph[x][y] == 0 ) {
        cell.style.backgroundColor = color;
        gInfo.graph[x][y] = nodeType+1;
    }  
}

//call this to update the start node with the new x and y location
function updateStartNode(gInfo, x, y){
    if(gInfo.startLoc != 0 && gInfo.graph[x][y] == 0){
        gInfo.graph[gInfo.startLoc[0]][gInfo.startLoc[1]] = 0
        let oldCell = document.getElementById(gInfo.startLoc[0] + "-" + gInfo.startLoc[1]);
        oldCell.style.backgroundColor = "";
    }
    if( gInfo.graph[x][y] == 0 ){
        gInfo.startLoc = [x,y];
    }
    else if(x == gInfo.startLoc[0] && y == gInfo.startLoc[1]){
        gInfo.startLoc = 0;
    }
}

function updateEndNode(gInfo, x, y){
    if(gInfo.endLoc != 0 && gInfo.graph[x][y] == 0){
        gInfo.graph[gInfo.endLoc[0]][gInfo.endLoc[1]] = 0
        let oldCell = document.getElementById(gInfo.endLoc[0] + "-" + gInfo.endLoc[1]);
        oldCell.style.backgroundColor = "";
    }
    if( gInfo.graph[x][y] == 0 ){
        gInfo.endLoc = [x,y];
    }
    else if(x == gInfo.endLoc[0] && y == gInfo.endLoc[1]){
        gInfo.endLoc = 0;
    }
}

//manhattan distance
function mD( loc1, loc2){
    return Math.abs(loc2[1]-loc1[1]) + Math.abs(loc2[0]-loc1[0]);
}


//create new neighbors
function getNeighbors(gInfo, r, c, emptyType = 0, endType = 2){
    let validR = [];
    let validC = [];
    let result = [];
    if( r+1 <= gInfo.rows-1 && (gInfo.graph[r+1][c] == emptyType || gInfo.graph[r+1][c] == endType) ){
        validR.push(r+1);
    }
    if( r-1 >= 0 && (gInfo.graph[r-1][c] == emptyType || gInfo.graph[r-1][c] == endType) ){
        validR.push(r-1);
    }
    if( c+1 <= gInfo.cols-1 && (gInfo.graph[r][c+1] == emptyType || gInfo.graph[r][c+1] == endType) ){
        validC.push(c+1);
    }
    if( c-1 >= 0 && (gInfo.graph[r][c-1] == emptyType || gInfo.graph[r][c-1] == endType) ){
        validC.push(c-1);
    }

    for( let i = 0; i < validR.length; i++ ){
        result.push(new Node([validR[i], c]));
    } 
    for( let i = 0; i < validC.length; i++ ){
        result.push(new Node([r ,validC[i]]));
    } 
    return result;
}

function Node(loc){
    this.g = 0;
    this.f = 0;
    this.loc = loc;
    this.parent = null;
    this.valid = true;
}

function locCompare(n1, n2){
    return (n1[0] == n2[0]) && (n1[1] == n2[1]);
}

//can use heap for the openList to improve time to search for min element
function aStar(gInfo){
    console.log(gInfo.startLoc);
    console.log(gInfo.endLoc);

    let closedList = [];
    let openList = [];
    let result = null;
    
    openList.push( new Node(gInfo.startLoc) );


    let exit = false;

    //openList.length > 0
    while( openList.length > 0){
        let current = removeMinNode(openList);
        //console.log( "Current node " + current.loc[0] + "-", current.loc[1]);
        //console.log("Current node is " + current.valid);
        
        //check if the node that was removed is valid, otherwise continue removing
        while (!current.valid){
            if (openList.length == 0){
                exit = true;
                break;
            }
            current = removeMinNode(openList);
        }    
        if(exit){
            return result;
        }   
        
        //add the current node to the closed list
        closedList.push(current);
        
        //check to see if we have reached the end
        if( locCompare(current.loc, gInfo.endLoc) ){
            result = current;
            return result;
        }

        //create neighbors of the current node
        neighbors = getNeighbors(gInfo, current.loc[0], current.loc[1]);

        for( let i = 0; i < neighbors.length; i++){
            let nGCost = current.g + 1;
            let nFCost = nGCost + mD(neighbors[i].loc, gInfo.endLoc);
           
            //check if element is in closed list with the location of the current neighbor, skip if it is
            let found = (undefined != closedList.find( e => locCompare(e.loc, neighbors[i].loc)) );
            if ( found ){
                continue;
            }

            //check if the current neighbor is already in the openList and if it is, update the path and cost if the current node has a better fcost
            let betterFCost = false;
            for(node in openList){
                if (node == 0){
                    break;
                }
                
                found = locCompare(node.loc, neighbors[i].loc);
                if( found && node.f > nFCost){
                    node.valid = false;
                    betterFCost = true;
                    break;
                }
            }
            
            if(betterFCost || !found){
                neighbors[i].g = nGCost;
                neighbors[i].f = nFCost;
                neighbors[i].parent = current.loc;
                openList.push(neighbors[i]);
                changeNode(gInfo, neighbors[i].loc[0], neighbors[i].loc[1], "yellow", 3);
            }
        }
    }

}

function removeMinNode(list){
    if( list.length == 0 ){
        return null;
    }
    else if( list.length == 1){
        let result = list.splice(0, 1);
        return result[0];
    }
    else{
        let minIndex = 0;
        for( let i = 1; i < list.length; i++ ){
            if( list[i].f < list[minIndex].f ){
                minIndex = i;
            }
        }
        let result = list.splice(minIndex, 1);
        return result[0]; 
    }
}


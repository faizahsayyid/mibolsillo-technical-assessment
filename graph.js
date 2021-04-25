// ===============
// Handle HTML
// ===============

var currentGraph = null;

// for "Create Graph" section
function createGraph(){
    //retrieve data 
    var graphInfo = document.getElementById("input-graph").value;
    var isTest = document.getElementById("is-test").checked;

    // make the graph based on given data
    currentGraph = createRailwayGraph(graphInfo, isTest);
    var outputStr = "";
    myGraphCities = currentGraph.cities.keys();

    // display the graph
    for (var city of myGraphCities){
        neighbours = currentGraph.getNeighbours(city);
        outputStr += city + " -> " + neighbours + "<br>";
    }
    document.getElementById("output-graph").innerHTML = outputStr;
    document.getElementById("create-btn").innerHTML = "Update Graph";
}

// for "Find the distance of a given route" section
function calcDist(){
    var outputStr = "";

    //retrieve data 
    var pathStr = document.getElementById("path").value;

    var path = pathStr.split('-');
    
    if (currentGraph == null){
        outputStr = "Error! Create a graph first!";
    }
    else{

        // calculate and display distance
        var dist = currentGraph.getDistanceOfPath(path);
        outputStr = "The distance of this path is: " + dist;
    }
    document.getElementById("output-distance").innerHTML = outputStr;
}

// for "Find the shortest route between two cities" section
function shortestRoute(){

    //retrieve data 
    var city1 = document.getElementById("city1").value;
    var city2 = document.getElementById("city2").value;

    var outputStr = "";

    if (currentGraph == null){
        outputStr = "Error! Create a graph first!"
    }
    else{
        // find route
        var path = currentGraph.getShortestRoute(city1, city2);

        if (path == "NO SUCH ROUTE"){
            outputStr = path;
        }
        else{
            // find distance of route
            var dist = currentGraph.getDistanceOfPath(path);
            var pathStr = path.join('-');

            //display findings
            outputStr = "The shortest route is: " + pathStr + "<br>" + "This route has a distance of: " + dist;
        }
    }
    document.getElementById("output-shortest").innerHTML = outputStr;
}

// for "Find all routes (max stops)" section
function routesWithinStops(){

    //retrieve data 
    var src = document.getElementById("src1").value;
    var dst = document.getElementById("dst1").value;
    var maxStops = parseInt(document.getElementById("stops").value);

    var outputStr = "";

    if (currentGraph == null){
        outputStr = "Error! Create a graph first!";
    }
    else{

        // find routes
        var paths = currentGraph.getRoutesWithinMaxStops(src, dst, maxStops);
        
        if (paths.length == 0){
            outputStr = "NO SUCH ROUTE";
        }
        else{

            for(var path of paths){
                // find distance of each path
                var dist = currentGraph.getDistanceOfPath(path);

                // display findings
                var pathStr = path.join('-')
                outputStr += "Route: " + pathStr + "<br>";
                outputStr += "This route has a distance of: " + dist + "<br>";
            }

            outputStr += "Total Number of routes: " + paths.length;
        }
    }
    document.getElementById("output-stops").innerHTML = outputStr;
}

// for "Find all routes (max distance)" section
function routesWithinDist(){

    //retrieve data 
    var src = document.getElementById("src2").value;
    var dst = document.getElementById("dst2").value;
    var maxDist = parseInt(document.getElementById("max-dist").value);

    var outputStr = "";

    if (currentGraph == null){
        outputStr = "Error! Create a graph first!"
    }
    else{
        // find routes
        var paths = currentGraph.getRoutesWithinDistance(src, dst, maxDist);
        
        if (paths.length == 0){
            outputStr = "NO SUCH ROUTE";
        }
        else{
            for(var path of paths){
                // find distance of each route
                var dist = currentGraph.getDistanceOfPath(path);

                //display findings
                var pathStr = path.join('-')
                outputStr += "Route: " + pathStr + "<br>";
                outputStr += "This route has a distance of: " + dist + "<br>";
            }
            outputStr += "Total Number of Routes: " + paths.length;
        }
    }
    document.getElementById("output-max-distance").innerHTML = outputStr;
}

// =======================
// Graph and Vertex Class
// =======================

//A vertex in our railway graph
class CityVertex {
    constructor(item){
        this.item = item;

        //adjacent cities mapped to the distance between this city and the adjacent city
        this.neighbours = new Map();
    }
}

// A directed graph representing a railway system
class RailwayGraph{
    constructor(){
        this.cities = new Map();
    }

    addCity(city){
        var cityVertex = new CityVertex(city);
        this.cities.set(city, cityVertex);
    }

    addEdge(city1, city2, distance){
        if (this.cities.has(city1) && this.cities.has(city2)){

            // get the corresponding city vertices
            var v1 = this.cities.get(city1);
            var v2 = this.cities.get(city2);

            // add city2 to the neighbours of city1
            v1.neighbours.set(v2, distance);
        }
    }

    // for checking if a city is in the graph
    isInGraph(city){
        return this.cities.has(city);
    }
    
    // create neighbours list
    getNeighbours(city){
        if (this.isInGraph(city)){
            var cityVertex = this.cities.get(city);
            var raw = cityVertex.neighbours.keys();
            var neighboursList = [];

            for (var v of raw){
                neighboursList.push(v.item);
            }
            return neighboursList;
        }
    }

    // return edge weight
    getDistance(city1, city2){
        if (this.cities.has(city1) && this.cities.has(city2)){
            // get the corresponding city vertices
            var v1 = this.cities.get(city1);
            var v2 = this.cities.get(city2);

            // retrieve the distance
            return v1.neighbours.get(v2);
        }
        else{
            return "One of the cities is not in the graph"
        }
    }

    // returns the length/distance of a given path in the graph
    getDistanceOfPath(path){
        var distSoFar = 0;
        for (var i = 0; i < path.length - 1; i++) {
            var newDist = this.getDistance(path[i], path[i + 1])
            if (newDist != null){
                distSoFar += this.getDistance(path[i], path[i + 1]);
            }
            else{
                distSoFar = "NO SUCH ROUTE"
                break;
            }
        }

        return distSoFar;
    }

    // returns the shortest path between city1 and city2
    // returns "NO SUCH ROUTE" if no route is found
    getShortestRoute(city1, city2){
        var dijkstraInfo = this.dijkstra(city1);
        var shortestDistances = dijkstraInfo[0];
        var prevVertex = dijkstraInfo[1];
        var curr = city2;
        var pathSoFar = [];

        if (shortestDistances.get(city2) == Infinity){
            return "NO SUCH ROUTE";
        }
        else{
            //get the shortest route from prevVertex
            while (curr != city1)
            {
                pathSoFar.push(curr);
                curr = prevVertex.get(curr);
            }
            pathSoFar.push(city1);
            return pathSoFar.reverse();
        }
    }

    // Dijkstra’s Shortest Path Algorithm
    dijkstra(startV){
        var visited = [];
        var currVertex = null;
        var shortestDistances = new Map();
        var prevVertex = new Map();

        // initialize shortestDistances
        for (var city of this.cities.values()){
            if(city.item == startV){
                shortestDistances.set(city.item, 0);
            }
            else{
                shortestDistances.set(city.item, Infinity);
            }
        }

        // loop until all vertices have been visited
        while(visited.length < this.cities.size){

            //get the vertex with that currently has the smallest distance from startV
            currVertex = this.minDistVertex(shortestDistances, visited);
            var neighbours = this.getNeighbours(currVertex);

            // if currVertex is null, it means that all the nodes have been visited excepts 
            // for the ones that are unreachable from startV
            if (currVertex == null){
                break;
            }

            for (var neighbour of neighbours){
                if(!visited.includes(neighbour)){

                    // calculate the distance of this neighbour to startV
                    var dist = shortestDistances.get(currVertex) + this.getDistance(currVertex, neighbour);
                    
                    // if this distance is shorter than the preveiously found distance, update it as 
                    // well as the previous vertex
                    if(dist < shortestDistances.get(neighbour)){
                        shortestDistances.set(neighbour, dist);
                        prevVertex.set(neighbour, currVertex);
                    }
                }
            }

            // mark the current vertex as visited
            visited.push(currVertex);
        }

        return [shortestDistances, prevVertex];
    }

    // helper function for dijkstra
    // return the cityVertex with a smallest distance in shortestDistances
    minDistVertex(shortestDistances, visited){
        var minDistSoFar = Infinity;
        var minCitySoFar = null;

        for (var city of shortestDistances.keys()){
            if (shortestDistances.get(city) < minDistSoFar && !visited.includes(city)){
                minDistSoFar = shortestDistances.get(city);
                minCitySoFar = city;
            }
        }
        return minCitySoFar;
    }

    // Return all the routes between two cities within the given maximim number of stops.
    getRoutesWithinMaxStops(src, dst, maxStops){
        var routes = this.getAllRoutes(src, dst);
        var routesWithinMax = []

        for (var route of routes){
            if (route.length <= maxStops + 2){
                routesWithinMax.push(route);
            }
        }
        return routesWithinMax
    }

    // Return all the routes between two cities within the given maximim distance allowed to travel.
    getRoutesWithinDistance(src, dst, maxDistance){
        var routes = this.getAllRoutes(src, dst);
        var routesWithinMax = []

        for (var route of routes){
            var dist = this.getDistanceOfPath(route)

            if (dist <= maxDistance){
                routesWithinMax.push(route);
            }
        }
        return routesWithinMax
    }

    // uses BFS
    getAllRoutes(src, dst){
        // enque to the back of the list
        // deque from the front of the list
        var queue = [];
        // store current path
        var path = [];
        var pathsFound = [];

        path.push(src);
        queue.push([...path]);

        while (queue.length > 0){
            path  = queue.shift();
            var last = path[path.length - 1]

            // if last is the same as our destination, this means that this path 
            // is a route from src to dst
            if (last == dst){
                pathsFound.push(path);
            }

            neighbours = this.getNeighbours(last);

            for (var neighbour of neighbours){
                if (!path.includes(neighbour)){
                    var newPath = [...path];
                    newPath.push(neighbour);
                    queue.push(newPath);
                }
            }
        }
        return pathsFound;
    }
}

// Creates graph from string input
// if this is not test data:
// input will have edges to add seperated by a semicolon and each 
// part of the edge seperated by a comma.
// ex. A,B,5; B,C,4; C,D,8; D,C,8; D,E,6; A,D,5; C,E,2; E,B,3; A,E,7
// if this is test data:
// ex. AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7

function createRailwayGraph(graphStr, isTestData){
    var graphSoFar = new RailwayGraph();
    
    if(isTestData)
    {
        // unpack data, to get each edge
        let edgeStrs = graphStr.split(", ");
        for(var e of edgeStrs){

            // add vertices, if not already in graph
            if (!graphSoFar.isInGraph(e[0])){
                graphSoFar.addCity(e[0]);
            }
            if (!graphSoFar.isInGraph(e[1])){
                graphSoFar.addCity(e[1]);
            }

            // add edge
            graphSoFar.addEdge(e[0], e[1], parseInt(e[2]));
        }
    }
    else{
        // unpack data, to get each edge
        let edgeStrs = graphStr.split("; ");

        for(var i = 0; i < edgeStrs.length; i++){

            // unpack data, to get each part of each edge
            edgeInfo = edgeStrs[i].split(",");

            // add vertices, if not already in graph
            if (!graphSoFar.isInGraph(edgeInfo[0])){
                graphSoFar.addCity(edgeInfo[0]);
            }
            if (!graphSoFar.isInGraph(edgeInfo[1])){
                graphSoFar.addCity(edgeInfo[1]);
            }

            // add edge
            graphSoFar.addEdge(edgeInfo[0], edgeInfo[1], parseInt(edgeInfo[2]));
        }
    }
    return graphSoFar
}

// export for testing
module.exports = {
    RailwayGraph: RailwayGraph
}
module.exports.createRailwayGraph = createRailwayGraph;
// ===================
// Handle HTML
// ===================

var currentGraph = null;

function createGraph(){
    var graphInfo = document.getElementById("input-graph").value;
    var isTest = document.getElementById("is-test").value;
    currentGraph = createRailwayGraph(graphInfo, isTest);
    var outputStr = "";
    
    myGraphCities = currentGraph.cities.keys();

    for (var city of myGraphCities){
        neighbours = currentGraph.getNeighbours(city);
        outputStr += city + " -> " + neighbours + "<br>";
    }
    document.getElementById("output-graph").innerHTML = outputStr;
    document.getElementById("create-btn").innerHTML = "Update Graph"
}


// ===================
// Graph Class
// ===================

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

    isInGraph(city){
        return this.cities.has(city);
    }
    
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
            v1 = this.cities.get(city1);
            v2 = this.cities.get(city2);

            // retrieve the distance
            return v1.neighbours.get(v2);
        }
        else{
            return null
        }
    }

    getDistanceOfPath(path){
        distSoFar = 0;
        for (i = 0; i < path.length - 1; i++) {
            newDist = this.getDistance(path[i], path[i + 1])
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
    // returns null if no route is found
    getShortestRoute(city1, city2){
        dijkstraInfo = dijkstra(city1);
        var shortestDistances = dijkstraInfo[0];
        var prevVertex = dijkstraInfo[1];
        var curr = city2;
        var pathSoFar = [];

        if (shortestDistances.get(city2) == Infinity){
            return "NO SUCH ROUTE";
        }
        else{
            while (curr != city1)
            {
                pathSoFar.push(curr);
                curr = prevVertex.get(curr);
            }
            return pathSoFar.reverse();;
        }
    }

    // Dijkstra’s Shortest Path Algorithm
    dijkstra(startV){
        var visited = [];
        var currVertex = null;
        var shortestDistances = new Map();
        var prevVertex = new Map();

        // initialize shortestDistances
        for (city in this.cities.values()){
            if(city == startV){
                shortestDistances.set(city, 0);
            }
            else{
                shortestDistances.set(city, Infinity);
            }
        }

        while(visited.length < this.cities.size){

            currVertex = minDistVertex(shortestDistances);

            for (neighbour in currVertex.neighbours.keys()){
                if(!visited.includes(neighbour))
                dist = shortestDistances.get(currVertex.item) + this.getDistance(currVertex.item, neighbour.item);

                if(dist < shortestDistances.get(neighbour)){
                    shortestDistances.set(neighbour, dist);
                    prevVertex.set(neighbour, cur);
                }
            }

            visited.push(currVertex);
        }

        return [shortestDistances, prevVertex];
    }

    // uses BFS
    getRoutesWithinMaxStops(src, dst, maxStops){
        // enque to the back of the list
        // deque from the front of the list
        var queue = [];

        // store current path
        var path = [];

        var stopsFound = 0;
        var pathsFound = [];

        path.push(src);
        queue.push([...path]);

        while (queue.length > 0 && stopsFound < maxStops){
            path  = queue.shift();
            var last = path[path.length - 1]

            if (last == dst){
                //print path
                pathsFound.push(path);
            }

            for (neighbour in this.getNeighbours(last)){
                if (!path.includes(neighbour)){
                    var newPath = [...path];
                    newPath.push(neighbour);
                    queue.append(newPath);
                }
            }
            stopsFound += 1;
        }
        return pathsFound;
    }

    // uses BFS
    getRoutesWithinDistance(src, dst, maxDistance){
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

            if (last == dst){
                pathDist = getDistanceOfPath(path)
                if (pathDist <= maxDistance){
                    //print path
                    pathsFound.push(path);
                }
            }

            for (neighbour in this.getNeighbours(last)){
                if (!path.includes(neighbour)){
                    var newPath = [...path];
                    newPath.push(neighbour);
                    queue.append(newPath);
                }
            }
        }
        return pathsFound;
    }
}

// helper function for dijkstra
// return the cityVertex with a smallest distance in shortestDistances
function minDistVertex(shortestDistances){
    var minDistSoFar = -1;
    var minCitySoFar = null;

    for (city in shortestDistances.keys()){
        if (shortestDistances.get(city) < minDistSoFar){
            minDistSoFar = shortestDistances.get(city);
            minCitySoFar = city;
        }
    }

    return this.cities.get(minCitySoFar);
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
        let edgeStrs = graphStr.split(", ");
        for(e in edgeStrs){

            if (!graphSoFar.isInGraph(e[0])){
                graphSoFar.addCity(e[0]);
            }
            if (!graphSoFar.isInGraph(e[1])){
                graphSoFar.addCity(e[1]);
            }
            graphSoFar.addEdge(e[0], e[1], parseInt(e[2]));
        }
    }
    else{
        let edgeStrs = graphStr.split("; ");

        for(i = 0; i < edgeStrs.length; i++){
            edgeInfo = edgeStrs[i].split(",");

            if (!graphSoFar.isInGraph(edgeInfo[0])){
                graphSoFar.addCity(edgeInfo[0]);
            }
            if (!graphSoFar.isInGraph(edgeInfo[1])){
                graphSoFar.addCity(edgeInfo[1]);
            }
            graphSoFar.addEdge(edgeInfo[0], edgeInfo[1], parseInt(edgeInfo[2]));
        }
    }
    return graphSoFar
}
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
            v1 = this.cities.get(city1);
            v2 = this.cities.get(city2);

            // add city2 to the neighbours of city1
            v1.neighbours.set(v2, distance);
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
    }

    getDistanceOfPath(path){
        distSoFar = 0;
        for (i = 0; i < path.length - 1; i++) {
            distSoFar += this.getDistance(path[i], path[i + 1]);
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
            return null;
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

    getAllRoutes(city1, city2, maxStops){
        
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
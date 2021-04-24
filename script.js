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

    // returns the shortest path between city1 and city2
    // Uses Dijkstra’s Shortest Path Algorithm
    getShortestRoute(city1, city2){
        var visited = [city1];
        var currVertex = this.cities.get(city1);
        var shortestDistances = new Map();

        for (city in this.cities.values()){
            if(city == city1){
                shortestDistances.set(city, 0)
            }
            else{
                shortestDistances.set(city, Infinity)
            }
        }
    }

    getAllRoutes(){

    }
}
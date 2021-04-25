const { test, expect } = require('@jest/globals');
const graph = require('./graph');
var RailwayGraph = graph.RailwayGraph; 
var createRailwayGraph = graph.createRailwayGraph

testGraph = new RailwayGraph();

testGraph.addCity("A");
testGraph.addCity("B");
testGraph.addCity("C");
testGraph.addCity("D");
testGraph.addCity("E");
testGraph.addEdge("A", "B", 5);
testGraph.addEdge("A", "D", 5);
testGraph.addEdge("A", "E", 7);
testGraph.addEdge("B", "C", 4);
testGraph.addEdge("C", "D", 8);
testGraph.addEdge("C", "E", 2);
testGraph.addEdge("D", "C", 8);
testGraph.addEdge("E", "B", 3);

test("properly calculates distance of path", () => {
    expect(testGraph.getDistanceOfPath(["A", "B", "C"])).toEqual(9);
    expect(testGraph.getDistanceOfPath(["A", "D"])).toEqual(5);
    expect(testGraph.getDistanceOfPath(["A", "D", "C"])).toEqual(13);
    expect(testGraph.getDistanceOfPath(["A", "E", "B", "C", "D"])).toEqual(22);
    expect(testGraph.getDistanceOfPath(["A", "E", "D"])).toEqual("NO SUCH ROUTE");
})

test("properly creates graph with given data", () => {
    let notTestData = "A,B,5; B,C,4; C,D,8; D,C,8; D,E,6; A,D,5; C,E,2; E,B,3; A,E,7";
    let testData = "AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7";
    g1 = createRailwayGraph(notTestData, false);
    g2 = createRailwayGraph(testData, true);

    expect(g1.cities.keys()).toEqual(testGraph.cities.keys());
    expect(g2.cities.keys()).toEqual(testGraph.cities.keys());
    for(var city of g1.cities){
        expect(g1.getNeighbours(city)).toEqual(testGraph.getNeighbours(city))
        expect(g2.getNeighbours(city)).toEqual(testGraph.getNeighbours(city))
    }
})
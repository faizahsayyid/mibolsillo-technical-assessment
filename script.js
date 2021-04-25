// const createRailwayGraph = require("./createRailwayGraph")
import {createRailwayGraph, RailwayGraph} from "graph";

var currentGraph = null;

function createGraph(){
    var graphInfo = document.getElementById("input-graph").value;
    currentGraph = createRailwayGraph(graphInfo);
    var outputStr = "";

    for (city in currentGraph.cities.keys()){
        neighbours = currentGraph.getNeighbours(city);
        outputStr += city + " -> " + neighbours + "<br>";
    }
    document.getElementById("output-graph").innerHTML = outputStr;
}
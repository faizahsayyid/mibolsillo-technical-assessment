# mibolsillo-technical-assessment
 
**Running the Project**

To run this project open this link: https://faizahsayyid.github.io/mibolsillo-technical-assessment/ . 
(If this link does not work, try: https://faizahsayyid.github.io/mibolsillo-technical-assessment/index.html)

You can also download this project and open the index.html file.

Note: When you open the site, Create a graph before moving onto the other sections

- You can find my implementation of the directed railway graph in graph.js, and a few tests for the graph methods in graph.test.js.
- I used JavaScript to create this project.
- I used HTML and CSS to display it. 
- For testing, I used the Jest testing framework. 

**Explantion of the solution**

I created two classes to implement the weighted directed graph representation of the railway. The first class is CityVertex which represents a city that appears as a stop in the railway. A CityVertex instance stores an item (the city name) and the neighbours of that city (cities that you can travel to with one train) as a map from adjacent city to the distance between this city and the adjacent city. The other class, is RailwayGraph which is the actual weighted directed graph that contains all our methods for finding routes and distances. This class stores all the vertices of the graph as a map from city name to city vertex. 

- To find the shortest route between two cities I used Dijkstra’s shortest path algorithm.
- To find all the routes between two cities I used an adaptation of the breath-first-search (BFS) algorithm.

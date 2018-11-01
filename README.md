# Sound-Spotter
development version currently launched at: https://agile-brushlands-48511.herokuapp.com/
The Spotify Sound Spotter is a project I realized during my generative Art and Design course. The assignment required the creation of a generative artwork, that represents a data model. After some intense research I decided to fetch the Spotify-Web-API and visualize personal user data through a spherical Three.js object. 

## Functionality 
This app provides two user modes. The first one is the “Single-User”, which is activated after a user has logged in. It provides information about favorite artists and genres. The genres will then be analyzed by popularity and mapped to the sphere. If a second user connects to the API another sphere gets drawn and the data two users have in common is being hilighted. Additionally, a button for switching the data and comparison is added. It’s also possible to choose between 3 different color schemes. 

## Languages: 
It was quite the challenge to develop the app with React and Three.js, since I had to create a React strucutre that provided different components for each part of the Three.js model. The combination with Node.js made the code even more complex. But I learned a lot about the structuring of bigger projects through it.

### setup

cd ./authorization_code 
node app.js

cd ./authorization_code/public/client
npm start

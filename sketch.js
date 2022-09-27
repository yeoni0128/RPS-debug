var titleImg, rockImg, scissorImg, paperImg;
var rock, scissor, paper, name, bg, resetButton;
var dataBase;
var gameState = 0;
var playerCount = 0;
var playerData;
var players = [];

function preload() {
  titleImg = loadImage("assets/RPS.png");
  rockImg = loadImage("assets/Rock.png");
  scissorImg = loadImage("assets/Scissors.png");
  paperImg = loadImage("assets/Paper.png");
  resetImg = loadImage("assets/reset.png");
}

function setup() {
  dataBase = firebase.database();
  getState();
  console.log(gameState);
  getPlayerCount();
  createCanvas(800, 600);
  if (gameState === 0) {
    showElements();
  }
  p1 = createSprite(100, height / 2, 50, 50);
  p1.shapeColor = "green";

  p2 = createSprite(width - 100, height / 2, 50, 50);
  p2.shapeColor = "yellow";

  players = [p1, p2];
}

function draw() {
  background("#13abb3");
  playButtonPressed();

  if (gameState === 1) {
    play();
  }

  if (playerCount === 2) {
    gameState = 1;
    gameStateUpdate(1);
  }
}

function getState() {
  dataBase.ref("gameState").on("value", function (data) {
    gameState = data.val();
  });
}

function getPlayerCount() {
  dataBase.ref("playerCount").on("value", function (data) {
    playerCount = data.val();
  });
}
function showElements() {
  title = createImg("assets/RPS.png");
  title.position(width / 2 - 150, height / 2 - 200);
  input = createInput("").attribute("placeholder", "Enter your name");
  input.position(width / 2 - 100, height / 2 + 100);
  input.class("customInput");
  button = createButton("Play");
  button.position(width / 2 - 90, height / 2 + 200);
  button.class("customButton");
}
function playButtonPressed() {
  button.mousePressed(() => {
    playerCount += 1;
    playerName = input.value();
    playerCountUpdate(playerCount);
    addPlayer(playerCount, playerName);
    title.hide();
    input.hide();
    button.hide();
  });
}

function playerCountUpdate(count, name) {
  dataBase.ref("/").update({
    playerCount: count,
  });
}
function getPlayerInfo() {
  dataBase.ref("players").on("value", (data) => {
    playerData = data.val();
  });
}

function gameStateUpdate(state) {
  dataBase.ref("/").update({
    gameState: state,
  });
}

function handleResetButton() {
  resetButton.mousePressed(() => {
    dataBase.ref("/").set({
      playerCount: 0,
      gameState: 0,
      players: {},
    });
    window.location.reload();
  });
}

function addPlayer(count, name) {
  var x,y
  if (playerCount === 1) {
    x = 100;
    y = height / 2;
  }
  if (playerCount === 2) {
    x = width - 100;
    y = height / 2;
  }
  var playerIndex = "players/player" + count;
  console.log(playerIndex);
  dataBase.ref(playerIndex).set({
    name: name,
    positionX: x,
    positionY: y,
    index:playerCount
  });
}

function createElements() {
  resetButton = createButton("Reset");
  resetButton.position(10, 10);
  rockButton = createButton("Rock");
  rockButton.position(width / 2 + 90, height - 50);
  rockButton.size(80, 40);
  rockButton.class("customButton2");
  paperButton = createButton("Paper");
  paperButton.position(width / 2, height - 50);
  paperButton.size(80, 40);
  paperButton.class("customButton2");
  scissorButton = createButton("Scissor");
  scissorButton.position(width / 2 - 90, height - 50);
  scissorButton.size(80, 40);
  scissorButton.class("customButton2");
}

function play() {
  getPlayerInfo();
  if (playerData !== null) {
    var index = 0
    var x = 0
    var y = 0
    for (var plr in playerData) {
      index = index + 1
      x = playerData[plr].positionX
      y = playerData[plr].positionY
      players[index - 1].position.x = x
      players[index - 1].position.y = y
      
    }
    
    handlePlayerControls()
  }

  drawSprites();
  createElements();
  handleResetButton();
}

function handlePlayerControls(i) {
  if (keyIsDown(UP_ARROW)) {
    y = y + 10
    players[i-1].position.y -= 10
    var playerIndex = "players/player" + i
    dataBase.ref(playerIndex).update({
      positionY: players[i-1].position.y
    })
  }
  if (keyIsDown(DOWN_ARROW)) {
    y = y - 10
    players[i-1].position.y += 10
    var playerIndex = "players/player" + i
    dataBase.ref(playerIndex).update({
      positionY: players[i-1].position.y
    })
  }

}

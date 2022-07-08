var PLAY=1;
var END=0;
var gameState=PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup;
var obstacle,obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obtaclesGroup;
var gameOver,restart, Hscore;



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //precargar las imágenes de Game Over y Resert
  gameOverImg = loadImage ("gameOver.png");
  restartImg = loadImage ("restart.png");  
  
  //precargar sonidos del juego
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
 
}

function setup() {
  createCanvas(600, 200);

  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //piso invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crea obstaculos y grupos de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //crear radio de colisión
  trex.setCollider("circle",0,0,40);
  trex.debug=false;
  
  //crear sprite de gameOver y restart
  gameOver = createSprite(300,70,100,40);
  gameOver.addImage(gameOverImg);
  gameOver.scale= 0.5;
  gameOver.visible=false;
   
   
  restart = createSprite(300,110,100,40);
  restart.addImage(restartImg);
  restart.scale=0.5;
  restart.visible=false;
  
  
  score = 0;
  
}

function draw() {
  background(180);
  
  
  fill("black");
  text("Puntuación: " + score, 500,50);
  
 
  //console.log("this is", gameState);
  
    if(gameState === PLAY){ 
      
      //mueve el piso
      ground.velocityX = -(6+score/1000);
            
      //puntuación
      score = score + Math.round(frameCount/60);
            
      //Poner sonido cada 100 puntos
      if(score>0 && score%100 === 0){
       checkPointSound.play() 
      }
      
      //piso
     if (ground.x < 0){
    ground.x = ground.width/2;
    }
      
      // agrega gravedad
      trex.velocityY = trex.velocityY + 0.5 
      
      //aparece las nubes
      spawnClouds();
  
  
       //aparece obstáculos en el suelo
      spawnObstacles();
      
      if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
      }
              
  }
  else if(gameState === END){
    
    //detiene el suelo (CREA)
    ground.velocityX = 0;
    trex.velocityY=0;
    
    //cambiar la animación del trex
    trex.changeAnimation("collided",trex_collided);
    
    
    //establecer un ciclo de vida a los objetos para que nunca sea destruido.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //detener las nubes y los obstáculos
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //mostrar imagenes de gameOver y restart
    gameOver.visible=true;
    restart.visible=true;
   
    
   }
 
  //salta cuando se presiona la barra espaciadora
  if(keyDown("space") && trex.y>=160) {
    trex.velocityY = -10;
    jumpSound.play ();
  }
  
  //evita que el Trex se caiga    
  trex.collide(invisibleGround);
  

  if(mousePressedOver(restart)){
    reset();
  }

  drawSprites();
}

function reset(){
 gameState = PLAY;
 gameOver.visible=false;
 restart.visible=false;

 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();

}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(600,165,10,40);
    //obstacle.velocityX= -(6 + score/200);
    obstacle.velocityX= ground.velocityX;
    
    //añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);

    
    
    //generar obstáculos al azar
    rand = Math.round(random(1,6));
    switch(rand){
        case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addImage(obstacle2);
        break;
        case 3: obstacle.addImage(obstacle3);
        break;
        case 4: obstacle.addImage(obstacle4);
        break;
        case 5: obstacle.addImage(obstacle5);
        break;
        case 6: obstacle.addImage(obstacle6);
        break;
        default:break;
    }
    //asignar escala y ciclo de vida al obstáculo
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    
  }
 
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    
    //asigna un ciclo de vida a la variable
    cloud.lifetime = 200;

    
    //ajusta la profundidad
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo
    cloudsGroup.add(cloud);

    }

}

  

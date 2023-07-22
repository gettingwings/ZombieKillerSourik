var life = 3,score = 0;
var bg,bgImg;
var player, playerImg, shooterImg;
var zombieGroup ,zombieImg, brokenZombieImg; 
var gameState = 1 //play=1; end=2; won=3
var playerCollided = false;
var heartImg0,heartImg1,heartImg2,heartImg3,heart;
var ammo, ammoImg, boomImg;
var zombiesToBeKilled = 25, zombiesCreated = 0;
var bullets = 20;
var gameEndText;

function preload(){
  bgImg = loadImage("assets/bg.jpeg")
  playerImg = loadImage("assets/shooter_2.png")
  shooterImg = loadImage("assets/shooter_3.png")
  bulletImg = loadImage("assets/bullet.png")
  zombieImg = loadImage("assets/zombie.png")
  brokenZombieImg = loadImage("assets/brokenZombie.png")

  heartImg0 = loadImage("assets/heart_0.png");
  heartImg1 = loadImage("assets/heart_1.png");
  heartImg2 = loadImage("assets/heart_2.png");
  heartImg3 = loadImage("assets/heart_3.png");

  ammoImg = loadImage("assets/ammo.png");
  boomImg = loadImage("assets/boom.png");
}

function setup() {  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20, displayHeight/2-40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1
  //creating the player sprite
  player = createSprite(140, height-300, 50, 50);
  player.addImage(playerImg)
  player.scale = 0.3
  //player.debug = true
  player.setCollider("rectangle",0,0,300,480)
  //create heart sprite
  heart = createSprite(width-120,50)
  heart.addImage(heartImg3);
  heart.scale = 0.2;
  //create ammo sprite
  ammo = createSprite(620,height-100);
  ammo.addImage(ammoImg);
  ammo.scale = 0.25;
  //create groups
  zombieGroup = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(0); 
  
  drawSprites();
  textSize(25);
  fill ("white");
  text("Bullets = "+bullets,40,50);
  text("ZombiesLeft = "+zombiesToBeKilled,40,100);
  
  //to display hearts/lives
  if(life === 3) heart.addImage(heartImg3)
  else if(life === 2) heart.addImage(heartImg2)
  else if(life === 1) heart.addImage(heartImg1)
  else heart.addImage(heartImg0)

  if(gameState==1){
    //gameState play

    //moving the player up and down 
    if(keyDown("UP_ARROW")){
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")){
      player.y = player.y+30
    }
    if(keyDown("RIGHT_ARROW") && bullets<6){
      player.x = player.x+30
    }

    if(player.y<100) player.y = 100
    if(player.y>height-130) player.y = height - 130

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      player.addImage(shooterImg)
      shootBullet();
    }

    //player goes back to original standing image once we stop pressing the space bar
    if(keyWentUp("space")){
      player.addImage(playerImg)
    }

    spawnZombies()

    for(zombie of zombieGroup){
      if(zombie.x<-10) {
        zombie.x = width+10;
        zombie.y = random(69,height-300);
        zombie.velocityX *= 1.5;
      }
    }

    //check collision between zombies and player
    player.overlap(zombieGroup,(p,z)=>{
      life -= 1
      if(life<=0 ){
        gameState = 2 // for end: zombied
        gameEndText = "You were zombied!";
      }
      z.destroy()
      previousY = p.y;
      p.y = -200
      setTimeout(()=>{p.y = previousY},2000)
    })

    //killing the zombie
    bulletGroup.overlap(zombieGroup,(b,z)=>{
      b.destroy();
      z.velocityX = -0.2;
      z.addImage(brokenZombieImg);
      z.scale = 0.7;
      z.setCollider("rectangle",0,0,50,50);
      setTimeout(()=>{z.destroy()},2000)
     
      bullets -= 1
      zombiesToBeKilled -= 1;
      
      if(zombiesToBeKilled<=0) gameState = 3 // for win
      if(bullets==0){
        gameState = 2; // for end: out of bullets
        gameEndText = "Sorry!! You are out of bullets.";
      }
    })
    //collect ammo
    if(player.isTouching(ammo)){
      bullets += 10;
      player.x = 140;
    }
    //cause explosion
    ammo.overlap(bulletGroup,(a,b)=>{
      b.destroy();
      a.addImage(boomImg);
      a.scale = 0.6;
      gameState = 2; // for end: shot the ammo
      gameEndText = "You caused an explosion!!";
    })
  }else if(gameState == 2){
    //gameState end
    player.visible = false;
    zombieGroup.destroyEach();
    textAlign(CENTER);
    textSize(50);
    text(gameEndText,width/2,height/2);
  }else if(gameState == 3){
    //gameState won
    player.x = width/2;
    player.scale = 0.6;
    textAlign(CENTER);
    textSize(50);
    text("All zombies eliminated. You won!!",width/2,height/2);
  }
}

function shootBullet(){
  var bullet = createSprite(player.x + 60,player.y-20,8,8);
  bullet.velocityX = 15;
  bullet.shapeColor = "white";
  bullet.life =  400;
  bullet.addImage(bulletImg);
  bullet.scale = 0.02;
  bulletGroup.add(bullet);
}

function spawnZombies(){
  if(frameCount%60==0 && zombiesCreated<=25 ){
    zombiesCreated += 1;
    let y = random(69,displayHeight-300);
    let zombie = createSprite(width-20,y);
    zombie.addImage(zombieImg);
    zombie.scale = 0.2;
    //zombie.debug = true
    zombie.setCollider("rectangle",0,0,400,1000);
    zombie.velocityX = -3;
    zombieGroup.add(zombie);
    //zombie.life = 400
  }
}

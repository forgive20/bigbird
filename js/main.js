var game = new Phaser.Game(400, 500, Phaser.AUTO, 'game_div');

var main_state = {
	preload: function(){
		this.game.stage.backgroundColor = '#71c5cf';

		this.game.load.image('bird', 'img/bird.png');

		this.game.load.image('pipe', 'img/pipe.png');

		this.game.load.audio('jump', 'voice/jump.wav');
	},

	create: function(){
		this.bird = this.game.add.sprite(100, 245, 'bird');

		this.bird.body.gravity.y = 1000;

		var that = this;
		game.input.mouse.onMouseDown = function(){
			that.jump();
		}
		game.input.touch.onTouchStart = function(){
			that.jump();
		}

		this.pipes = game.add.group();
		this.pipes.createMultiple(20, 'pipe');

		this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

		this.score = 0;
		var style = {font: '30px Arial', fill: '#ffffff'};

		this.label_score = this.game.add.text(20, 20, '0', style);

		this.bird.anchor.setTo(-0.2, 0.5);

		this.jump_sound = this.game.add.audio('jump');
		this.jump_sound.volume = 0.2;
	},

	update: function(){
		if(this.bird.inWorld == false){
			this.restart_game();
		}

		this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

		if(this.bird.angle < 20){
			this.bird.angle += 1;
		}
	},

	jump: function(){
		if(this.bird.alive == false){
			return;
		}

		this.bird.body.velocity.y = -350;
		var animation = this.game.add.tween(this.bird).to({angle: -20}, 100).start();

		this.jump_sound.play();
	},

	restart_game: function(){
		this.game.state.start('main');
		this.game.time.events.remove(this.timer);
	},

	add_one_pipe: function(x, y){
		var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
		pipe.body.velocity.x = -230;
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},

	add_row_of_pipes: function(){
		var hole = Math.floor(Math.random()*5) + 1;

		for(var i = 0; i < 10; i++){
			if(i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3){
				this.add_one_pipe(400, i * 60 + 10);
			}
		}

		this.timer2 = this.game.time.events.add(1500, this.score_add, this);
	},

	score_add: function(){
		this.score += 1;
		this.label_score.content = this.score;
	},

	hit_pipe: function(){
		if(this.bird.alive == false){
			return;
		}

		this.bird.alive = false;

		this.game.time.events.remove(this.timer);

		this.pipes.forEachAlive(function(p){
			p.body.velocity.x = 0;
		}, this)
	}
}

game.state.add('main', main_state);
game.state.start('main');
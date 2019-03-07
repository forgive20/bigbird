var game = new Phaser.Game(400, 600, Phaser.AUTO, 'game_div');

var main_state = {
	preload: function(){
		this.game.stage.backgroundColor = '#71c5cf';

		this.game.load.image('bird', 'img/bird.png');

		this.game.load.image('pipe', 'img/pipe.png');
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
	},

	update: function(){
		if(this.bird.inWorld == false){
			this.restart_game();
		}

		this.game.physics.overlap(this.bird, this.pipes, this.show_result, null, this)
	},

	jump: function(){
		this.bird.body.velocity.y = -350;
	},

	restart_game: function(){
		this.game.state.start('main');
		this.game.time.events.remove(this.timer);
	},

	add_one_pipe: function(y){
		var pipe = this.pipes.getFirstDead();
		pipe.reset(400, y);
		pipe.body.velocity.x = -230;
		pipe.outOfBoundsKill = true;
	},

	add_row_of_pipes: function(){
		var hole = Math.floor(Math.random()*5) + 1;

		for(var i = 0; i < 10; i++){
			if(i != hole && i != hole + 1){
				this.add_one_pipe(i * 60 + 10);
			}
		}

		this.timer2 = this.game.time.events.add(1500, this.score_add, this);
	},

	score_add: function(){
		this.score += 1;
		this.label_score.content = this.score;
	},

	show_result: function(){

		var style = {font: '80px Arial', fill: '#ffffff'};

		this.resutl_text = this.game.add.text(100, 200, '0', style);
		this.resutl_text.content = '辣鸡！';

		this.timer3 = this.game.time.events.add(50, function(){game.state.paused('main');}, this);
	}
}

game.state.add('main', main_state);
game.state.start('main');
function Game(w,h) {
    this.width = w;
    this.height = h;
    this.cellSize = 5;
    this.fps = 5;
};

Game.prototype.start = function(){
    var canvas = document.querySelector('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    this.drawTable();
    this.generateValues();
    this.addCell();
};

Game.prototype.drawTable = function() {

    var cols = this.width / this.cellSize;
    var rows = this.height / this.cellSize;

    var context = document.querySelector('canvas').getContext('2d');
    context.rect(0,0,this.width,this.height);
    context.fillStyle = '#000';
    context.fill();

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){

                context.fillStyle = '#111';
                context.fillRect(i * this.cellSize,j * this.cellSize,this.cellSize - 1,this.cellSize - 1);

        }
    }

};

Game.prototype.drawCells = function(){
    var cols = this.width / this.cellSize;
    var rows = this.height / this.cellSize;

    var context = document.querySelector('canvas').getContext('2d');
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            if(this.cells[i][j] === 0){
                context.fillStyle = '#111';
                context.fillRect(i * this.cellSize,j * this.cellSize,this.cellSize - 1,this.cellSize - 1);
            }else{
                context.fillStyle = '#f00';
                context.fillRect(i * this.cellSize,j * this.cellSize, this.cellSize - 1, this.cellSize - 1);
            }

        }
    }
};


Game.prototype.generateValues = function(value) {

    var cols = this.width / this.cellSize;
    var rows = this.height / this.cellSize;
    var cells = [];

    for(var i = 0; i < cols; i++){
        cells[i] = [];
        for(var j = 0; j < rows; j++){

            cells[i][j] = value === 'random' ? Math.round(Math.random()) : 0;

        }
    }

    this.cells = cells;

};

Game.prototype.renderCellsStates = function() {

    if(!this.animation_id){

        this.animation_id = undefined;

        var self = this;

        var now;
        var then = Date.now();
        var delta;

        function generation() {

           var interval = 1000/self.fps;

           self.animation_id = window.requestAnimationFrame(generation);

           now = Date.now();
           delta = now - then;

           if(delta > interval){
               then = now - (delta % interval);

               self.nextGeneration();
               self.drawCells();
           }
        }


        this.animation_id = window.requestAnimationFrame(generation);
    }

};

Game.prototype.nextGeneration = function(){
    var next = [];
    var cols = this.width / this.cellSize;
    var rows = this.height / this.cellSize;



    for(var i = 0; i < cols; i++){
        next[i] = [];
        for(var j = 0; j < rows; j++){
            next[i][j] = [];
            var sum = 0;

            sum +=  this.cells[((i-1)+cols)%cols][((j-1)+cols)%cols];
            sum +=  this.cells[((i-1)+cols)%cols][j];
            sum +=  this.cells[((i-1)+cols)%cols][((j+1)+cols)%cols];

            sum +=  this.cells[i][((j+1)+cols)%cols];
            sum +=  this.cells[i][((j-1)+cols)%cols];
            //sum -=  this.cells[i][j];


            sum +=  this.cells[((i+1)+cols)%cols][((j-1)+cols)%cols];
            sum +=  this.cells[((i+1)+cols)%cols][j];
            sum +=  this.cells[((i+1)+cols)%cols][((j+1)+cols)%cols];



            if(this.cells[i][j] === 0 && sum === 3){
                next[i][j] = 1;
            }else if(this.cells[i][j] === 1 && (sum < 2 || sum > 3)){
                next[i][j] = 0;
            }else {
                next[i][j] = this.cells[i][j];
            }

        }
    }
    this.cells = next;

};

Game.prototype.pause = function(){

    var self = this;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    if(self.animation_id){
        cancelAnimationFrame(self.animation_id);
        self.animation_id = undefined;
    }

};

Game.prototype.stop = function(){
    this.pause();
    this.generateValues();
    this.drawCells();
};

Game.prototype.changeFPS = function(value){
    this.fps = value;
};


Game.prototype.randomCells = function(){
    this.generateValues('random');
    this.drawCells();
};

Game.prototype.addCell = function(){

    var self = this;
    var cols = this.width / this.cellSize;
    var rows = this.height / this.cellSize;

    document.onclick = function(e){
        var gCanvasElement = document.querySelectorAll('canvas');
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= gCanvasElement[0].offsetLeft;
        y -= gCanvasElement[0].offsetTop;

        var row = Math.floor(x/self.cellSize);
        var coll = Math.floor(y/self.cellSize);

        if((0 <= row && row < rows) && (0 <= coll && coll < cols)){
            self.cells[row][coll] === 1 ? self.cells[row][coll] = 0 : self.cells[row][coll] = 1;
            self.drawCells();
        }
    };
};





document.addEventListener('DOMContentLoaded', function() {
    game = new Game(1000, 1000);
    game.start();
});




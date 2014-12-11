App = function () {
    var gridSize = {x: 6, y: 3};
    var cellSize = {x: 140, y: 190};
    var hiddenCards = [];
    var indices = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    this.load = function () {
        wade.loadImage('../img/asl/back.png');
        wade.loadImage('../img/asl/1.png');
        wade.loadImage('../img/asl/2.png');
        wade.loadImage('../img/asl/3.png');
        wade.loadImage('../img/asl/4.png');
        wade.loadImage('../img/asl/5.png');
        wade.loadImage('../img/asl/6.png');
        wade.loadImage('../img/asl/7.png');
        wade.loadImage('../img/asl/8.png');
        wade.loadImage('../img/asl/9.png');
    };
    this.init = function () {
        for (var k = 0; k < 10; k++) {
            var a = Math.floor(Math.random() * indices.length);
            var b = Math.floor(Math.random() * indices.length);
            var temp = indices[a];
            indices[a] = indices[b];
            indices[b] = temp;
        }
        for (var i = 0; i < gridSize.x; i++) {
            for (var j = 0; j < gridSize.y; j++) {
                this.createCard(i, j);
            }
        }
    };
    this.createCard = function (i, j) {
        var x = (i - gridSize.x / 2 + 0.5) * cellSize.x;
        var y = (j - gridSize.y / 2 + 0.5) * cellSize.y;
        var sprite = new Sprite('../img/asl/back.png');
        var card = new SceneObject(sprite, 0, x, y);
        wade.addSceneObject(card);
        var index = indices[i + j * gridSize.x];
        var aslSprite = new Sprite('../img/asl/' + index + '.png');
        var asl = new SceneObject(aslSprite, 0, x, y);
        wade.addSceneObject(asl);
        sprite.bringToFront();
        card.animalIndex = index;
        card.onMouseUp = function () {
            if (hiddenCards.length == 0) {
                // hide the current card
                this.setVisible(false);
                hiddenCards.push(this);
            }
            else if (hiddenCards.length == 1) {
                // hide the current card
                this.setVisible(false);
                hiddenCards.push(this);

                // see if it matches the card that was already hidden
                if (hiddenCards[0].animalIndex == hiddenCards[1].animalIndex) {
                    hiddenCards.length = 0;
                }
                else {
                    // no match, so show both cards again
                    setTimeout(function () {
                        hiddenCards[0].setVisible(true);
                        hiddenCards[1].setVisible(true);
                        hiddenCards.length = 0;
                    }, 1000);
                }
            }
        };
        wade.addEventListener(card, 'onMouseUp');
    };
};

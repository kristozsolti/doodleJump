document.addEventListener('DOMContentLoaded', () => {
    let intervalSpeed = 30;
    let moveIntervalSpeed = 20;
    const gridWidth = 400;
    const gridHeight = 600;
    const doodlerWidth = 60;
    const platformHeight = 15;
    const platformWidth = 85;
    const grid = document.querySelector('.grid');
    const background = document.createElement('div');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let score = 0;

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for(let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms() {
        if(doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    let newPlatform = new Platform(gridHeight);
                    platforms.push(newPlatform);
                    score++;
                }
            });
        }
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace > startPoint + 200) {
                fall();
            }
            if(doodlerBottomSpace >= 400) {
                grid.style.animation = 'scrollToTop 10s';
                setTimeout(() => grid.style.backgroundPosition = 'left top', 10000);
            }
        }, intervalSpeed);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if((doodlerBottomSpace >= platform.bottom) && 
                (doodlerBottomSpace <= platform.bottom + platformHeight) &&
                (doodlerLeftSpace + doodlerWidth >= platform.left) &&
                (doodlerLeftSpace <= platform.left + platformWidth) &&
                !isJumping) {
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })
        }, intervalSpeed);
    }

    function gameOver() {
        isGameOver = true;

        // reset the grid and delete elements
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e) {
        if(e.key === 'ArrowLeft') {
            moveLeft();
        } else if(e.key === 'ArrowRight') {
            moveRight();
        } else if(e.key === 'ArrowUp') {
            moveStraight();
        }

    }

    function moveLeft() {
        if(isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function() {
            if(doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveRight();
            }
        }, moveIntervalSpeed);
    }

    function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function() {
            if(doodlerLeftSpace <= gridWidth - doodlerWidth) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveLeft();
            }
        }, moveIntervalSpeed);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start() {
        if(!isGameOver) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, intervalSpeed);
            jump();
            document.addEventListener('keyup', control);
        }
    }

    // attach to button
    start();

});
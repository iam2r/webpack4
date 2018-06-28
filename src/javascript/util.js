export default {
    random(min, max) {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    },
    isHit(r1, r2) {
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        // 默认没有碰撞
        hit = false;
        // 获取两个 sprite 的中心点在x,y轴上的值
        r1.centerX = r1.x;
        r1.centerY = r1.y;
        r2.centerX = r2.x;
        r2.centerY = r2.y;
        //获取 sprite 的半宽或半高
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
        // 计算两个 sprite 的 x y 轴的距离
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
        // 计算两个 sprite 的半宽之和及半高之和
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;
        // 首先判断 x 轴方面，如果 x 轴中心点距离小于两个 sprit 的半宽和，则判断 y 轴方面
        if (Math.abs(vx) < combinedHalfWidths) {
            // 如果 y 轴方面半宽和也小于 y 轴中心点的距离，则判定为碰撞
            hit = Math.abs(vy) < combinedHalfHeights;
        } else {
            // 否则没有发生碰撞
            hit = false;
        }
        return hit;
    },
    keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = (event) => {
            console.log(event.keyCode)
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = (event) => {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    },
    contain(sprite, container) {

        let collision = undefined;

        //Left
        if (sprite.x < container.x) {
            sprite.x = container.x;
            collision = "left";
        }

        //Top
        if (sprite.y < container.y) {
            sprite.y = container.y;
            collision = "top";
        }

        //Right
        if (sprite.x + sprite.width > container.width) {
            sprite.x = container.width - sprite.width;
            collision = "right";
        }

        //Bottom
        if (sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
            collision = "bottom";
        }

        //Return the `collision` value
        return collision;
    },
    getRadian(startSprite, endSprite) {
        let endX = endSprite.x + endSprite.width / 2;
        let endY = endSprite.y + endSprite.height / 2;
        let startX = startSprite.x + startSprite.width / 2;
        let startY = startSprite.y + startSprite.height / 2;
        let dx = endX - startX;
        let dy = endY - startY;
        let dl = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let cos = dx / dl;
        let radian = dy < 0 ? 2 * Math.PI - Math.acos(cos) : Math.acos(cos);
        return radian
    }

};
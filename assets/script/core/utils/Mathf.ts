export class Mathf {
    /**
     * 角度转弧度
     */
    public static deg2Rad: number = Math.PI / 180;

    /**
     * 弧度转角度
     */
    public static rad2Deg: number = 180 / Math.PI;

    /**
     * 获得随机方向
     */
    public static sign(x: number) {
        if (x > 0) {
            return 1;
        }
        if (x < 0) {
            return -1;
        }
        return 0;
    }

    /** 随时间变化进度值 */
    public static progress(start: number, end: number, t: number) {
        return start + (end - start) * t;
    }

    /**
     * 插值
     * @param numStart 
     * @param numEnd 
     * @param t 
     */
    public static lerp(numStart: number, numEnd: number, t: number): number {
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0
        }

        return numStart * (1 - t) + (numEnd * t);
    }

    /**
     * 
     * @param angle1 角度插值
     * @param angle2 
     * @param t 
     */
    public static lerpAngle(current: number, target: number, t: number): number {
        current %= 360;
        target %= 360;

        var dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        }
        else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        return (Mathf.lerp(current, target, t) % 360 + 360) % 360;
    }

    /**
     * 按一定的速度从一个角度转向令一个角度
     * @param current 
     * @param target 
     * @param speed 
     */
    public static angleTowards(current: number, target: number, speed: number): number {
        current %= 360;
        target %= 360;

        var dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        }
        else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        var dir = target - current;

        if (speed > Math.abs(dir)) {
            return target;
        }

        return ((current + speed * Math.sign(dir)) % 360 + 360) % 360;
    }

    public static clamp(value: number, minLimit: number, maxLimit: number) {
        if (value < minLimit) {
            return minLimit;
        }

        if (value > maxLimit) {
            return maxLimit;
        }

        return value;
    }

    /**
     * 获得一个值的概率
     * @param value 
     */
    public static probability(value: number) {
        return Math.random() < value;
    }
}


class RaspiBlaster {
    timeout: NodeJS.Timer;
    interval: NodeJS.Timer;

    r: 23;
    g: 18;
    b: 24;

    red: 0;
    green: 0;
    blue: 0;

    set(red, green, blue) {
        piblaster.setPwm(this.r, red);
        this.red = red;
        piblaster.setPwm(this.g, green);
        this.green = green;
        piblaster.setPwm(this.b, blue);
        this.blue = blue;
    }

    hex2Rgb(hexStr) {
        const hex = parseInt(hexStr, 16);
        const r = (hex & 0xff0000) >> 16;
        const g = (hex & 0x00ff00) >> 8;
        const b = hex & 0x0000ff;
        return [r, g, b];
    }

    setHex(hexColor) {
        const rgb = this.hex2Rgb(hexColor);

        console.log(`R: ${rgb[0]}`);
        console.log(`G: ${rgb[1]}`);
        console.log(`B: ${rgb[2]}`);

        this.set(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    }

    getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    fadeTo(hex, duration) {
        const rgbs = this.hex2Rgb(hex);
        const rgb = [rgbs[0] / 255, rgbs[1] / 255, rgbs[2] / 255];

        duration /= 20;
        this.set(this.red, this.green, this.blue);

        const _rgb = [this.red, this.green, this.blue];
        this.fadestep(_rgb, rgb, 0, duration);
    }

    fadestep(_rgb, rgb, i, duration) {
        if (i > duration) return;

        const fraction = i / duration;
        const red = _rgb[0] + (fraction * (rgb[0] - _rgb[0]));
        const green = _rgb[1] + (fraction * (rgb[1] - _rgb[1]));
        const blue = _rgb[2] + (fraction * (rgb[2] - _rgb[2]));

        this.set(red, green, blue);
        i++;
        this.timeout = setTimeout(() => { this.fadestep(_rgb, rgb, i, duration); }, 20);
    }

    clearInterval() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    blink(hexColor) {
        this.interval = setInterval(() => { this.fadeTo(hexColor, 400); setTimeout(() => { this.fadeTo("000000", 400) }, 800) }, 1600);
    }

    cycle() {
        this.interval = setInterval(() => { this.fadeTo(this.getRandomColor(), 500); }, 1000);
    }
}
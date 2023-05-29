class MonAscii {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private src: string;
  //   private static ASCII_TEXT = "Ñ@#W$9876543210?!abc;:+=-,._  ";
  //   private static ASCII_TEXT = " _~,-=+:;cba!?0123456789$W#@Ñ";

  //   private static ASCII_TEXT = "@#O%+=|:. ";
  private static ASCII_TEXT = " .:|=+%O#@";
  //   private static ASCII_TEXT = ` .'\`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`;
  private static FONT_SIZE = 6;

  constructor(src: string, id = "canvas") {
    this.canvas = <HTMLCanvasElement>document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.src = src;
  }

  get data(): ImageData | undefined {
    return this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  set data(value: ImageData | undefined) {
    if (!value) return;
    this.ctx?.putImageData(value, 0, 0);
  }

  private async load(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = this.src;
      image.addEventListener("load", () => {
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        resolve(image);
      });

      image.addEventListener("error", error => {
        reject(error);
      });
    });
  }

  /**
   * Returns the brightness value based on the chosen formula. Available: Relative luminance, AERT, HSP, simple average
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @returns {number} brightness (0-1)
   */
  private calculateBrightness(red: number, green: number, blue: number): number {
    // Relative luminance formula
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    // AERT formula
    // return 0.299 * red + 0.587 * green + 0.114 * blue;
    // HSP formula
    // return Math.sqrt(red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114);
    // Simple average
    return (red + green + blue) / 3;
  }

  /**
   * Reset canvas to 'black' rect
   */
  private resetCanvas() {
    if (!this.ctx) return;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Returns a single character from the ASCII_TEXT
   * @param {number} brightness
   * @returns {string} single-character from ASCII_TEXT
   */
  private mapToChar(brightness: number): string {
    return MonAscii.ASCII_TEXT.charAt(Math.round(brightness * MonAscii.ASCII_TEXT.length) - 1);
  }

  /**
   * Converts image to grayscale
   */
  public toGrayscale = () => {
    // this.image.addEventListener("load", () => {
    //   this.ctx?.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    //   if (!this.data) return;
    //   const _data = this.data.data;
    //   for (let i = 0; i < _data.length; i += 4) {
    //     const avgColor = (_data[i] + _data[i + 1] + _data[i + 2]) / 3;
    //     _data[i] = avgColor;
    //     _data[i + 1] = avgColor;
    //     _data[i + 2] = avgColor;
    //   }
    //   this.data = new ImageData(_data, this.canvas.width, this.canvas.height);
    // });
    return this;
  };

  public toAscii = async () => {
    const ascii_image: [char: string, x: number, y: number][][] = [];
    try {
      const image = await this.load();

      this.ctx?.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

      if (!this.data) return;
      const _data = this.data;

      for (let h = 0; h < this.canvas.height; h += MonAscii.FONT_SIZE) {
        const row: Array<[char: string, x: number, y: number]> = [];
        for (let w = 0; w < this.canvas.width; w += MonAscii.FONT_SIZE) {
          const red = _data.data[h * 4 * _data.width + w * 4] / 255;
          const green = _data.data[h * 4 * _data.width + (w * 4 + 1)] / 255;
          const blue = _data.data[h * 4 * _data.width + (w * 4 + 2)] / 255;
          const brightness = this.calculateBrightness(red, green, blue);
          row.push([this.mapToChar(brightness), w, h]);
        }
        ascii_image.push(row);
      }
      if (!this.ctx) return;
      this.resetCanvas();
      this.ctx.fillStyle = "white";
      this.ctx.font = `${MonAscii.FONT_SIZE}px monospace`;

      ascii_image.forEach(row => row.forEach(([char, x, y]) => this.ctx?.fillText(char, x, y)));
    } catch (error) {
      console.error(error);
    }
  };

  public toText = async (): Promise<string[] | null> => {
    const ascii_image: string[] = [];

    return new Promise((resolve, reject) => {
      this.load().then(image => {
        this.ctx?.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

        if (!this.data) throw new Error("not working");
        const _data = this.data;

        for (let h = 0; h < this.canvas.height; h += MonAscii.FONT_SIZE) {
          let row = "";
          for (let w = 0; w < this.canvas.width; w += MonAscii.FONT_SIZE) {
            const red = _data.data[h * 4 * _data.width + w * 4] / 255;
            const green = _data.data[h * 4 * _data.width + (w * 4 + 1)] / 255;
            const blue = _data.data[h * 4 * _data.width + (w * 4 + 2)] / 255;
            const brightness = this.calculateBrightness(red, green, blue);
            row += this.mapToChar(brightness);
          }
          ascii_image.push(row);
        }
        this.resetCanvas();
        resolve(ascii_image);
      });
    });
  };
}

export { MonAscii };

export default class Bubble extends Phaser.GameObjects.Container {
  bubble!: Phaser.GameObjects.Graphics;
  bubbleWidth: number = 0;
  bubbleHeight: number = 0;
  bubblePadding: number = 10;
  arrowHeight: number = this.bubbleHeight / 4;
  content!: Phaser.GameObjects.Text;
  timer: any;
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene.add.existing(this);
  }
  makeBubble(content: string) {
    this.initSize(content);
    this.bubble = this.scene.add.graphics({ x: 0, y: 0 });
    this.bubble.fillStyle(0xffffff, 1);
    this.bubble.lineStyle(4, 0x565656, 1);
    this.bubble.strokeRoundedRect(
      0,
      0,
      this.bubbleWidth,
      this.bubbleHeight,
      16
    );
    this.bubble.fillRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
    this.bubble.setDepth(0);
    this.add(this.bubble);
    this.makeArrow();
    this.makeContent(content);
  }
  makeArrow() {
    //  Calculate arrow coordinates
    const point1X = Math.floor(this.bubbleWidth / 7);
    const point1Y = this.bubbleHeight;
    const point2X = Math.floor((this.bubbleWidth / 7) * 2);
    const point2Y = this.bubbleHeight;
    const point3X = Math.floor(this.bubbleWidth / 7);
    const point3Y = Math.floor(this.bubbleHeight + this.arrowHeight);

    //  Bubble arrow shadow
    this.bubble.lineStyle(4, 0x222222, 0.5);
    this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    this.bubble.fillTriangle(
      point1X,
      point1Y,
      point2X,
      point2Y,
      point3X,
      point3Y
    );
    this.bubble.lineStyle(2, 0x565656, 1);
    this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);
  }
  makeContent(content: string) {
    this.content = this.scene.add.text(0, 0, content, {
      fontSize: "12px",
      color: "#000000",
      align: "center",
      wordWrap: { width: this.bubbleWidth - this.bubblePadding * 2 },
    });
    const b = this.content.getBounds();

    this.content.setPosition(
      this.bubbleWidth / 2 - b.width / 2,
      this.bubbleHeight / 2 - b.height / 2
    );
    this.add(this.content);
  }

  initSize(content: string) {
    const { width, height } = this.getWidthHeight(content);
    this.bubbleHeight = height + this.bubblePadding * 2;
    this.bubbleWidth = width + this.bubblePadding * 2;
    this.arrowHeight = this.bubbleHeight / 4;
  }

  getWidthHeight(text: string) {
    this.makeContent(text);
    const result = {
      width: this.content.width,
      height: this.content.height,
    };
    this.content.destroy();
    return result;
  }

  showContent(content: string) {
    this.setVisible(true);
    this.removeAll(true);
    this.makeBubble(content);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setVisible(false);
    }, 5000);
    return this;
  }
}

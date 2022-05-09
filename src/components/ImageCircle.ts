export default class ImageCircle extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image;
  circle: Phaser.GameObjects.Graphics;
  radius: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    image: Phaser.GameObjects.Image | string,
    radius?: number
  ) {
    super(scene, x, y);
    if (typeof image === "string") {
      this.image = new Phaser.GameObjects.Image(scene, 0, 0, image);
    } else {
      this.image = image;
    }
    // get radius by radius param or half of shortest image size
    this.radius = radius || Math.min(this.image.width, this.image.height) / 2;
    // add graphics into the scene and fill it with circle
    // importance to set circle position to the (x, y)first
    this.circle = scene.add
      .graphics()
      .setPosition(x, y)
      .fillCircle(0, 0, this.radius);
    // add image into the child of container
    this.add(this.image);
    // set mask image by the circle graphics
    this.image.setMask(this.circle.createGeometryMask());
  }
  updateMaskTransform() {
    const transform = this.image.getWorldTransformMatrix();
    this.circle
      .setPosition(transform.getX(0, 0), transform.getY(0, 0))
      .setScale(transform.scaleX, transform.scaleY);
  }
}

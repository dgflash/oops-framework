import { CCInteger, color, Component, Enum, Label, Layers, Mask, math, Node, Overflow, Sprite, SpriteFrame, UITransform, Vec3, _decorator } from 'cc';
import { RoundRectMask } from './RoundRectMask';

const { ccclass, property } = _decorator;

// 徽标位置
export enum Position {
    // 左上角
    TOP_LEFT = 0,
    // 右上角
    TOP_RIGHT = 1,
}

Enum(Position);

@ccclass('Badge')
export class Badge extends Component {
    @property({ type: SpriteFrame, tooltip: '背景' })
    bg: SpriteFrame | null = null;
    @property({ tooltip: '内容' })
    string: string = '6';
    @property({ type: CCInteger, tooltip: '宽' })
    width: number = 30;
    @property({ type: CCInteger, tooltip: '高' })
    height: number = 26;
    @property({ type: CCInteger, tooltip: '圆角' })
    radius: number = 6;
    @property({ type: Position, tooltip: '位置\n 0: 左上角 \n 1: 右上角' })
    position: Position = Position.TOP_LEFT;
    // 徽标位置
    public static POSITION: Position;

    private badgeNode: Node = null!;
    private color = color(214, 30, 30, 240);
    private textColor = color(255, 255, 255, 255);
    private labelNode: Node = null!;

    public get text(): string {
        return this.string;
    }
    public set text(text: string) {
        this.string = text;
        this.setText(text);
    }

    onLoad() {
        this.initBadge();
    }

    // 初始化badge，插入节点等操作
    initBadge() {
        const badgeNode = this.createBadge();

        this.node.addChild(badgeNode);
        console.log('badgeNode:', badgeNode);
    }

    // 设置位置
    setPosition(position: Position) {
        const parentSize = this.node.getComponent(UITransform)?.contentSize as math.Size;
        const badgeSize = this.badgeNode.getComponent(UITransform)?.contentSize as math.Size;

        switch (position) {
            case Position.TOP_LEFT: {
                const x = -parentSize.width / 2;
                const y = parentSize.height / 2;

                this.badgeNode.setPosition(new Vec3(x, y, 0));
                break;
            }
            case Position.TOP_RIGHT: {
                const x = parentSize.width / 2;
                const y = parentSize.height / 2;

                this.badgeNode.setPosition(new Vec3(x, y, 0));
                break;
            }
        }
    }

    // 设置文字
    setText(text: string) {
        this.text = text;
        const label = this.labelNode.getComponent(Label);

        if (label) {
            label.string = this.text;
            label.color = this.textColor;
        }
        return this;
    }

    createBadge() {
        this.badgeNode = new Node('BadgeNode');
        const backgroundNode = new Node('backgroundNode');
        this.labelNode = new Node('labelNode');

        this.badgeNode.layer = Layers.Enum.UI_2D;
        backgroundNode.layer = Layers.Enum.UI_2D;
        this.labelNode.layer = Layers.Enum.UI_2D;

        // 设置mask
        this.badgeNode.addComponent(Mask);
        this.badgeNode.addComponent(RoundRectMask).radius = this.radius;
        this.badgeNode.getComponent(UITransform)?.setContentSize(this.width, this.height);
        this.badgeNode.active = true;

        // 设置背景
        const _sprite = backgroundNode.addComponent(Sprite);
        _sprite.type = Sprite.Type.SIMPLE;
        _sprite.color = this.color;
        _sprite.spriteFrame = this.bg;

        backgroundNode.getComponent(UITransform)?.setContentSize(this.width, this.height);

        // 设置label信息
        const _label = this.labelNode.addComponent(Label);
        _label.getComponent(UITransform)?.setContentSize(this.width, this.height);
        _label.string = this.text;
        _label.color = this.textColor;
        _label.fontSize = 18;
        _label.isBold = true;
        _label.horizontalAlign = Label.HorizontalAlign.CENTER;
        _label.verticalAlign = Label.VerticalAlign.CENTER;
        _label.lineHeight = 0;
        _label.overflow = Overflow.NONE;
        _label.enableWrapText = false;

        // 添加节点
        this.badgeNode.addChild(backgroundNode);
        this.badgeNode.addChild(this.labelNode);
        this.setPosition(this.position);

        return this.badgeNode;
    }

    start() { }
}

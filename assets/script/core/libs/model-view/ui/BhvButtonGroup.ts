import { Button, color, Color, Component, Enum, EventHandler, SpriteFrame, _decorator } from "cc";

const { ccclass, property, menu } = _decorator;

enum PARAM_TYPE {
    CHILDREN_INDEX,
    CHILDREN_NAME
}

/**
 * 群体事件，适合绑定节点组的回调信息
 * 将该组件的所处节点的所有子节点，绑定相同的回调对象，并将组件名设置到customEventData属性中
 */
@ccclass
@menu("添加特殊行为/UI/Button Group(一组按钮控制)")
export default class BhvButtonGroup extends Component {
    @property({
        type: Enum(Button.Transition)
    })
    transition: number = Button.Transition.NONE;

    @property({ visible: function () { return this.transition === Button.Transition.COLOR } })
    hoverColor: Color = color(255, 255, 255);

    @property({ visible: function () { return this.transition === Button.Transition.COLOR } })
    normalColor: Color = color(214, 214, 214);

    @property({ visible: function () { return this.transition === Button.Transition.COLOR } })
    pressedColor: Color = color(211, 211, 211);

    @property({ visible: function () { return this.transition === Button.Transition.COLOR } })
    disabledColor: Color = color(124, 124, 124);

    @property({
        type: SpriteFrame,
        visible: function () { return this.transition === Button.Transition.SPRITE }
    })
    normalSprite: SpriteFrame | null = null;

    @property({
        type: SpriteFrame,
        visible: function () { return this.transition === Button.Transition.SPRITE }
    })
    pressedSprite: SpriteFrame | null = null;

    @property({
        type: SpriteFrame,
        visible: function () { return this.transition === Button.Transition.SPRITE }
    })
    hoverSprite: SpriteFrame | null = null;

    @property({
        type: SpriteFrame,
        visible: function () { return this.transition === Button.Transition.SPRITE }
    })
    disabledSprite: SpriteFrame | null = null;

    @property({ visible: function () { return this.transition === Button.Transition.SCALE || this.transition === Button.Transition.COLOR } })
    duration: number = 1.0;

    @property({ visible: function () { return this.transition === Button.Transition.SCALE } })
    zoomScale: number = 1.1;

    @property({
        type: Enum(PARAM_TYPE)
    })
    paramType: PARAM_TYPE = PARAM_TYPE.CHILDREN_INDEX;

    @property({
        type: [EventHandler]
    })
    touchEvents: EventHandler[] = [];

    @property({
        tooltip: '规避3.x引擎BUG，EventHandler.component位为空导致找不到触发事件的脚本名的问题',
        readonly: true
    })
    EventHandler_component: string = "VMModify";

    onLoad() {
        this.node.children.forEach((node, nodeIndex) => {
            let comp: Button = node.getComponent(Button)!;
            if (comp == null) comp = node.addComponent(Button);

            // 同步属性

            // comp.target = node;
            // comp.transition = this.transition;
            // comp.zoomScale = this.zoomScale;

            // comp.disabledSprite = this.disabledSprite;
            // comp.hoverSprite = this.hoverSprite;
            // comp.normalSprite = this.normalSprite;
            // comp.pressedSprite = this.pressedSprite;

            // comp.hoverColor = this.hoverColor;
            // comp.normalColor = this.normalColor;
            // comp.pressedColor = this.pressedColor;
            // comp.disabledColor = this.disabledColor;

            //绑定回调事件

            this.touchEvents.forEach((event) => {
                // 克隆数据，每个节点获取的都是不同的回调
                let hd = new EventHandler();//copy对象
                hd.component = event.component == "" ? this.EventHandler_component : event.component;
                hd.handler = event.handler;
                hd.target = event.target;
                if (this.paramType === PARAM_TYPE.CHILDREN_INDEX) {
                    hd.customEventData = nodeIndex.toString();
                }
                else {
                    hd.customEventData = node.name;
                }
                comp.clickEvents.push(hd);
            })
        });
    }
}

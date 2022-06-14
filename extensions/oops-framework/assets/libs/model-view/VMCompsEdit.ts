import { CCString, Component, Enum, log, Node, _decorator } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property, executeInEditMode, menu, help } = _decorator;

enum ACTION_MODE {
    SEARCH_COMPONENT,
    ENABLE_COMPONENT,
    REPLACE_WATCH_PATH,
    DELETE_COMPONENT
}


/**
 * 用于搜索的MV 组件列表，挂载在父节点后，
 * 会遍历搜索下面的所有MV组件, 并且显示其观察值的路径
 */
@ccclass
@executeInEditMode
@menu('ModelViewer/Edit-Comps (快速组件操作)')
@help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMCompsEdit.md')
export default class MVCompsEdit extends Component {
    @property({
        type: [CCString]
    })
    findList: string[] = ["VMBase", "VMParent"];

    @property({
        type: Enum(ACTION_MODE)
    })
    actionType: ACTION_MODE = ACTION_MODE.SEARCH_COMPONENT;

    @property({
        tooltip: '勾选后,会自动查找 find list 中填写的组件',
        visible: function () { return this.actionType === ACTION_MODE.SEARCH_COMPONENT }
    })
    public get findTrigger() {
        return false;
    }
    public set findTrigger(v: boolean) {
        this.setComponents(0);
    }

    @property({
        tooltip: '勾选后,会批量激活 find list 中填写的组件',
        visible: function () { return this.actionType === ACTION_MODE.ENABLE_COMPONENT }
    })
    public get enableTrigger() {
        return false;
    }
    public set enableTrigger(v: boolean) {
        this.setComponents(1);
    }

    @property({
        tooltip: '勾选后,会批量关闭 find list 中填写的组件',
        visible: function () { return this.actionType === ACTION_MODE.ENABLE_COMPONENT }
    })
    public get disableTrigger() {
        return false;
    }
    public set disableTrigger(v: boolean) {
        this.setComponents(2);
    }

    @property({
        tooltip: '允许删除节点的组件,确定需要移除请勾选,防止误操作',
        visible: function () { return this.actionType === ACTION_MODE.DELETE_COMPONENT }
    })
    allowDelete: boolean = false;

    @property({
        tooltip: '勾选后,会批量删除 find list 中填写的组件',
        displayName: '[ X DELETE X ]',
        visible: function () { return this.allowDelete && this.actionType === ACTION_MODE.DELETE_COMPONENT }
    })
    public get deleteTrigger() {
        return false;
    }
    public set deleteTrigger(v: boolean) {
        this.setComponents(3);
    }

    @property({
        tooltip: '勾选后,会批量替换掉指定的路径',
        visible: function () { return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH }
    })
    public get replaceTrigger() {
        return false;
    }
    public set replaceTrigger(v: boolean) {
        this.setComponents(4);
    }

    @property({
        tooltip: '匹配的路径,匹配规则: 搜索开头为 game的路径',
        visible: function () { return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH }
    })
    targetPath: string = 'game';

    @property({
        tooltip: '替换的路径,将匹配到的路径替换',
        visible: function () { return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH }
    })
    replacePath: string = '*';


    @property({
        tooltip: '是否搜集绑定VM组件的节点?',
        visible: function () { return this.actionType === ACTION_MODE.SEARCH_COMPONENT }
    })
    canCollectNodes: boolean = false;

    @property({
        type: [Node],
        readonly: true,
        tooltip: '收集到绑定了VM组件相关的节点，可以自己跳转过去',
        visible: function () { return this.canCollectNodes && this.actionType === ACTION_MODE.SEARCH_COMPONENT }
    })
    collectNodes: Node[] = [];

    onLoad() {
        //不要把脚本挂载运行时的提示
        if (!EDITOR) {
            let path = this.getNodePath(this.node);
            console.error('you forget delete MVEditFinder,[path]', path);
        }
    }

    setComponents(state: number) {
        let array = this.findList;
        let title = '搜索到当前节点下面的组件';
        switch (state) {
            case 0: title = '搜索到当前节点下面的组件'; break;
            case 1: title = '激活以下节点的组件'; break;
            case 2: title = '关闭以下节点的组件'; break;
            case 3: title = '删除以下节点的组件'; break;
            case 4: title = '替换以下节点的路径'; break;

            default:
                break;
        }
        log(title)
        log('______________________')

        array.forEach(name => {
            this.searchComponent(name, state)
        })

        log('______________________')
    }

    /**
     * 
     * @param className 
     * @param state 0-查找节点组件 1-激活节点组件 2-关闭节点组件 3-移除节点组件
     */
    searchComponent(className: string, state: number = 0) {
        /**收集节点清空 */
        this.collectNodes = [];

        let comps = this.node.getComponentsInChildren(className);
        if (comps == null || comps.length < 1) return;
        log('[' + className + ']:');
        comps.forEach(v => {
            let ext = '';

            if (state <= 3) {
                //区分模板模式路径
                if (v.templateMode === true) {
                    ext = v.watchPathArr ? ':[Path:' + v.watchPathArr.join('|') + ']' : ''
                } else {
                    ext = v.watchPath ? ':[Path:' + v.watchPath + ']' : ''
                }
            }

            log(this.getNodePath(v.node) + ext);
            switch (state) {
                case 0://寻找组件
                    if (this.canCollectNodes) {
                        if (this.collectNodes.indexOf(v.node) === -1) {
                            this.collectNodes.push(v.node);
                        }
                    }
                    break;
                case 1://激活组件
                    v.enabled = true;
                    break;
                case 2://关闭组件
                    v.enabled = false;
                    break;
                case 3://删除组件
                    v.node.removeComponent(v);
                    break;
                case 4://替换指定路径

                    let targetPath = this.targetPath;
                    let replacePath = this.replacePath;
                    if (v.templateMode === true) {
                        for (let i = 0; i < v.watchPathArr.length; i++) {
                            const path = v.watchPathArr[i];
                            v.watchPathArr[i] = this.replaceNodePath(path, targetPath, replacePath);
                        }
                    }
                    else {
                        v.watchPath = this.replaceNodePath(v.watchPath, targetPath, replacePath);
                    }


                default:
                    break;
            }
        });
    }

    replaceNodePath(path: string, search: string, replace: string) {
        let pathArr = path.split('.');
        let searchArr = search.split('.');
        let replaceArr = replace.split('.')

        let match = true;
        for (let i = 0; i < searchArr.length; i++) {
            //未匹配上
            if (pathArr[i] !== searchArr[i]) {
                match = false;
                break;
            }

        }

        //匹配成功准备替换路径
        if (match === true) {
            for (let i = 0; i < replaceArr.length; i++) {
                pathArr[i] = replaceArr[i];
            }
            log(' 路径更新:', path, '>>>', pathArr.join('.'))
        }

        return pathArr.join('.');
    }

    getNodePath(node: Node) {
        let parent = node;
        let array = [];
        while (parent) {
            let p = parent.getParent();
            if (p) {
                array.push(parent.name);
                parent = p;
            }
            else {
                break;
            }
        }
        return array.reverse().join('/');
    }
}

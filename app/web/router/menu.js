/**
 * 菜单配置
 *
 * 菜单是个集合，由菜单元素组合而成，每个菜单元素具有下列属性：
 *
 * - path 必填，url路径字符串，可以设置为route对象，例如{name:'login', query:{redirect: 'abc'}}，
 *   如果菜单元素拥有children，则点击条目也不会进行跳转，而是进行展开。
 * - title 必填，菜单的标题
 * - icon 可选，菜单的图标
 * - permission 可选，菜单所需要的权限
 * - children 可选，但path和children必须要有一个。有path时会忽略children。
 *
 * @module router/menu
 */
const menu = []

export default menu;

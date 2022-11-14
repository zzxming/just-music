import { Directive } from 'vue';

let count = 1;
/** 计算滚动并设置滚动属性 */
function computedRoll(el: HTMLElement, cloneNode: Element) {
    // 将原元素宽度自动, 获取文字宽度
    el.style.width = 'auto';
    if (!cloneNode) return;
    // 若超出父级元素, 则进行滚动处理
    if (el.offsetWidth >= (el.parentElement as HTMLElement).offsetWidth) {
        el.classList.add('roll');
        el.style.width = 'auto';
        cloneNode.classList.add('roll');
    }
    else {
        el.classList.remove('roll');
        el.style.width = '100%';
        cloneNode.classList.remove('roll');
    }
}

/** 文字超出滚动 */
export const textRoll: Directive<HTMLElement> = {
    mounted(el) {
        el.style.display = 'inline-block';
        el.classList.add('roll');
        el.id = `${el.tagName}${count++}`;
        const cloneNode = el.cloneNode(true) as HTMLElement;
        cloneNode.setAttribute('clone-roll-node', 'true');
        // 当直接进入时, 文字内容是存在的, 初始化一次
        computedRoll(el, cloneNode);
        el.parentElement?.append(cloneNode);
    },
    updated(el) {
        // 使用id，确保存在
        let existCloneNodes = document.querySelector(`#${el.id}[clone-roll-node]`);
        // 文字变化跟随
        if (existCloneNodes) {
            if (existCloneNodes.textContent !== el.textContent) {
                existCloneNodes.textContent = el.textContent;
                // 计算是否需要滚动
                computedRoll(el, existCloneNodes)
            }
        }
    }
}


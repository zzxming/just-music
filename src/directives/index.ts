import { textRoll } from '@/directives/textRoll';
import { Directive } from 'vue';

export const customDirective: { [key:string]: Directive<HTMLElement> } = {
    textRoll
}

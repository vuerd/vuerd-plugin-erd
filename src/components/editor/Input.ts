import {
  defineComponent,
  html,
  FunctionalComponent,
  watch,
  query,
} from '@dineug/lit-observable';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { SIZE_MIN_WIDTH } from '@/core/layout';
import { useDestroy } from '@/core/hooks/destroy.hook';

declare global {
  interface HTMLElementTagNameMap {
    'vuerd-input': InputElement;
  }
}

export interface InputProps {
  edit: boolean;
  focusState: boolean;
  select: boolean;
  active: boolean;
  width: number;
  value: string;
  placeholder: string;
}

export interface InputElement extends InputProps, HTMLElement {}

const Input: FunctionalComponent<InputProps, InputElement> = (props, ctx) => {
  const destroy = useDestroy();
  const inputRef = query<HTMLInputElement>('input');

  const getClassMap = () => ({
    'vuerd-input': true,
    placeholder: props.value.trim() === '' && !props.edit,
    focus: props.focusState && !props.edit,
    edit: props.edit,
    select: props.select,
    active: props.active,
  });

  const getPlaceholderValue = () =>
    props.value.trim() === '' ? props.placeholder : props.value;

  const onBlur = () => ctx.dispatchEvent(new Event('blur'));

  destroy.push(
    watch(props, propName => {
      if (propName === 'edit' && props.edit) {
        const input = inputRef.value;
        if (!input) return;

        const len = input.value.length;
        input.selectionStart = len;
        input.selectionEnd = len;
        input.focus();
      }
    })
  );

  return () =>
    props.edit
      ? html`
          <input
            class=${classMap(getClassMap())}
            style=${styleMap({
              width: `${props.width}px`,
            })}
            type="text"
            spellcheck="false"
            .value=${props.value}
            placeholder=${props.placeholder}
            @blur=${onBlur}
          />
        `
      : html`
          <div
            class=${classMap(getClassMap())}
            style=${styleMap({
              width: `${props.width}px`,
            })}
          >
            <span>${getPlaceholderValue()}</span>
          </div>
        `;
};

defineComponent('vuerd-input', {
  observedProps: [
    {
      name: 'edit',
      type: Boolean,
      default: false,
    },
    {
      name: 'focusState',
      type: Boolean,
      default: false,
    },
    {
      name: 'select',
      type: Boolean,
      default: false,
    },
    {
      name: 'active',
      type: Boolean,
      default: false,
    },
    {
      name: 'width',
      type: Number,
      default: SIZE_MIN_WIDTH,
    },
    {
      name: 'value',
      default: '',
    },
    {
      name: 'placeholder',
      default: '',
    },
  ],
  shadow: false,
  styleMap: {
    display: 'inline-flex',
  },
  render: Input,
});
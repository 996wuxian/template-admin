import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives' // 在style中使用unocss

export function setupUnocss() {
  return UnoCSS({
    presets: [presetUno(), presetAttributify(), presetIcons()],
    rules: [
      // 在这个可以增加预设规则, 也可以使用正则表达式
      [
        'p-c', // 使用时只需要写 p-c 即可应用该组样式
        {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%)`
        }
      ],
      [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })]
    ],
    transformers: [transformerDirective()]
  })
}

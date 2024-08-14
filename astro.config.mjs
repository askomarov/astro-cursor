import { defineConfig, squooshImageService } from 'astro/config'
import viteSassGlob from 'vite-plugin-sass-glob-import'
import icon from 'astro-icon'


// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  // site: 'https://htmlonelove.github.io',
  compressHTML: false,
  output: 'static',
  publicDir: './public',
  build: {
    format: 'file', // вытаскивает вложенные страницы в корень src/pages/subpage/subpage.html => dist/subpage.html
    // assets: 'assets',
    assetsPrefix: '.', // добавляет `.` в пути скриптов и стилей
    // inlineStylesheets: 'never', // запрещает инлайн стилей
  },
  image: {
    service: squooshImageService(),
  },
  integrations: [
    icon({
      svgoOptions: {
        plugins: [
          'preset-default'
        ],
      },
    })
  ],
  vite: {
    css: {
      devSourcemap: true,
    },
    build: {
      minify: false,
      assetsInlineLimit: 0, // запрещает инлайн скриптов. по дефолту инлайнит скрипты в html
      cssCodeSplit: false, // css в один файл
      rollupOptions: {
        output: {
          entryFileNames: 'scripts-[hash].js',
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1)
            if (/png|jpe?g|svg|webp|avif|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img'
            }
            if (/css/.test(extType)) {
              extType = 'css'
            }
            return `${extType}/[name]-[hash][extname]`
          }
        },
      },
    },
    plugins: [
      viteSassGlob()
    ],
  },
})

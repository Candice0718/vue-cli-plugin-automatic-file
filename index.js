const path = require('path');
// 引入自动生成文件的webpack plugin
const AutoMaticWebpackPlugin = require('automatic-webpack-plugin');

module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        let options = [{
                /*********** 组件自动化注册 ***********/
                // 文件监听等级
                maxlevel: 1,
                // 监听./src/router/*下的文件夹
                inPath: api.resolve('src/components'),
                // 自动在./src/router/目录下生成index.js
                outPath: api.resolve('src/components/index.js'),
                // 模板
                // fileName: 文件夹名称
                // filePath: 文件夹路径
                templateEach: (fileName, filePath) => {
                    // chunk名称
                    const chunkName = (
                        api.resolve(filePath).replace(api.resolve('src/components'), '')
                    ).split(path.sep).join('/');
                    return `Vue.component('${fileName}', () => import(/* webpackChunkName: "components${chunkName}" */ '.${chunkName}/${fileName}.vue'));`;
                },
                /**
                 * 输出模板
                 * template: 模板名称
                 * modules: 模板模块名称
                 */
                out: (template, modules) => {
                    return `
                        /* eslint-disable */
                        /**
                         * @desc 组件自动化注册
                         * @important 此文件禁止手动修改！
                         */
                        ${template}
                    `;
                },
                // 自动新建index入口文件
                addIndex: [{
                        // 默认路由
                        state: 'file',
                        name: (fileName, filePath) => `${fileName}.vue`,
                        template: (fileName, filePath) => {
                            return `
                                <template>
                                    <div>
                                        组件 ${fileName}
                                    </div>
                                </template>
                                <script>
                                export default {
                                    name: '${fileName}'
                                };
                                </script>
                            `
                        }
                    }
                ]
                /*********** 组件自动化注册 ***********/
            },  {
                /*********** 路由自动化注册 ***********/
                // 文件监听等级
                maxlevel: 1,
                // 监听./src/router/*下的文件夹
                inPath: api.resolve('src/pages'),
                // 自动在./src/router/目录下生成index.js
                outPath: api.resolve('src/pages/index.js'),
                // 模板
                // fileName: 文件夹名称
                // filePath: 文件夹路径
                templateEach: (fileName, filePath) => {
                    return `${fileName}: () => import( /* webpackChunkName: "pages/${fileName}" */"./${fileName}/${fileName}.vue"),`;
                },
                /**
                 * 输出模板
                 * template: 模板名称
                 * modules: 模板模块名称
                 */
                out: (template, modules) => {
                    return `
                            /* eslint-disable */
                            /**
                             * @desc 页面自动化注册
                             * @important 此文件禁止手动修改！
                             */
                            // 路由配置
                            const pages = {
                                ${template}
                            };
                            export default pages;
                        `;
                },
                // 自动新建index入口文件
                addIndex: [
                    {
                        // 默认路由
                        state: 'file',
                        name: (fileName, filePath) => `${fileName}.vue`,
                        template: (fileName, filePath) => {
                            return `
                                <template>
                                    <div>
                                        路由 page-${fileName}
                                    </div>
                                </template>
                                <script>
                                export default {
                                    name: '${fileName}'
                                };
                                </script>
                            `
                        }
                    }
                ]
                /*********** 路由自动化注册 ***********/
            },
            {
                /*********** sass文件自动化注册 ***********/
                // 文件监听等级
                maxlevel: 1,
                // 监听./src/sass/*下的文件夹
                inPath: api.resolve('src/sass'),
                // 自动在./src/sass/目录下生成base.scss
                outPath: api.resolve('src/sass/base.scss'),
                // 模板
                // fileName: 文件夹名称
                // filePath: 文件夹路径
                templateEach: (fileName, filePath) => {
                    return `@import "${fileName}/index.scss";`;
                },
                /**
                 * 输出模板
                 * template: 模板名称
                 * modules: 模板模块名称
                 */
                out: (template, modules) => {
                    return `
                        /* eslint-disable */
                        /**
                         * @desc sass文件自动化注册
                         * @important 此文件禁止手动修改！
                         */
                        ${template}
                    `;
                }
                /***********sass文件自动化注册 ***********/
            }
        ];
        webpackConfig.plugin('automatic').use(AutoMaticWebpackPlugin, [options]);
    })
}
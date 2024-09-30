export default {
  entryPoints: ['src/index.ts'], // 指定入口文件
  format: ['cjs', 'esm'], // 同时输出cjs和esm格式
  clean: true, // 打包前清理目标目录
  dts: true, // 打包类型声明文件
  sourcemap: true, // 生成源映射
};

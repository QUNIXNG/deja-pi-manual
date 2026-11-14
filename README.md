# deja-pi-manual

一个只提供手动 `/deja` 搜索命令的 Pi 扩展。

**历史索引、搜索程序与核心能力来自上游项目 [vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)。本仓库不是 deja-vu 的替代品或独立实现，只是本机 Pi 的手动搜索入口。**

## 与上游默认接入的区别

- 只注册 `/deja <关键词>` 命令。
- 不注册自动召回钩子。
- 不在每轮提示词或工具结果中自动注入历史。
- 调用本机 deja 的 `search --no-embed`，使用本地索引搜索。

## 先安装上游 deja-vu

请按上游项目说明安装并建立索引：

https://github.com/vshulcz/deja-vu

本扩展会依次尝试环境变量 `DEJA_BIN`、PATH 中的 `deja`、`~/.local/bin/deja`，以及 `@vshulcz/deja-vu-<平台>-<架构>` 包内的程序。

## 安装本扩展

将 `deja.ts` 放到：

```text
~/.pi/agent/extensions/deja.ts
```

重新加载扩展后，使用：

```text
/deja 要查找的文件、命令、报错或历史操作
```

例如：

```text
/deja GROUP_DISABLED
/deja pi-lens 升级
```

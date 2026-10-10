# 奥数思维课 · 来源与版权

## 课程内容
除下面“OpenStax 改编单元”外，讲解、例题、测验、单元测试和动画全部为本项目原创（简体中文）。

## OpenStax 改编单元（om15 解方程：等式的性质）
- 文件：`web/courses/olympiad/content-openstax.mjs`
- Adapted from OpenStax, *Prealgebra 2e*, Rice University (2020), §8.1–8.2, https://openstax.org/details/books/prealgebra-2e ，CC BY-NC-SA 4.0（https://creativecommons.org/licenses/by-nc-sa/4.0/）。
- 改动：译为简体中文、精简改写为“天平”故事、更换例题数字；测验题、引入故事、小知识和动画为原创。
- **该文件按 CC BY-NC-SA 4.0 授权（非商业、相同方式共享），不适用本项目的 MIT 许可证。** 本项目作者仅用于个人非商业学习。不代表 OpenStax 或 Rice University 认可。

经典名题按自己的话重新讲述，原始题目属于公有领域：
- 高斯求和（1+2+…+100 的故事）
- 柯尼斯堡七桥问题（欧拉，1736）
- 鸡兔同笼、“物不知数”（韩信点兵）——《孙子算经》
- 百鸡问题——《张丘建算经》
- 盈不足——《九章算术》
- 汉诺塔（卢卡斯，1883）

## 已核查但没有使用的候选（2026-10-11 核查）
| 候选 | 核查结果 | 结论 |
| --- | --- | --- |
| GitHub vastxie/Elementary-Mathematical-Olympiad（小学奥数讲义） | 仓库没有许可证（GitHub API: license = none），README 写“仅供学习交流使用” | 不能改编，未使用 |
| OpenStax *Prealgebra 2e* | CC BY-NC-SA 4.0（不是 CC BY），禁止商用 | 用户确认仅个人非商业学习后，只在 om15 一个单元中改编（见上） |
| NanamiNakano/Math4Babies（给宝宝的数学） | README 声明 CC BY-SA 4.0，但仓库现已无法访问，且不是奥数内容 | 未使用 |
| Art of Problem Solving、《华罗庚数学》等 | 商业版权 | 未使用 |

## 工具与字体
- 动画用 [Remotion](https://www.remotion.dev) 预先渲染为 WebM（VP9），源代码在 `remotion/`。Remotion License：个人、≤3 人的公司和非营利组织可免费使用。
- 动画为儿童蜡笔插画风格：手绘线条用 [rough.js](https://github.com/rough-stuff/rough)（MIT），蜡笔质感用 SVG 滤镜实现（`remotion/src/crayon.jsx`）。30 段视频合计约 25 MB（WebM 约 24.7 MB，加封面和字幕约 27 MB）。
- 动画内中文字体：站酷快乐体 ZCOOL KuaiLe（SIL Open Font License 1.1，许可全文 `remotion/public/ZCOOLKuaiLe-OFL.txt`）；个别符号由 Noto Sans SC（SIL OFL 1.1）补字。都只打包用到的字形子集（`remotion/public/`）。

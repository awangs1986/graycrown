export default {
  id: 'physics', version: 1, status: 'available',
  title: { en: 'Classical Physics · Foundations (adapted from OpenStax)', 'zh-CN': '经典物理入门（改编自 OpenStax）' },
  description: { en: '11 units from measurement to heat. Every stage teaches first — concept, formula and a step-by-step worked example — then tests you. Realistic photos of each phenomenon. Adapted into Chinese from OpenStax Physics (CC BY 4.0).', 'zh-CN': '从测量与单位到温度与热，共 11 个单元。每个阶段先讲解（概念、公式、分步例题），再测验；单元末有综合测试。每课配真实物理现象照片。改编自 OpenStax《Physics》（CC BY 4.0）。' },
  exerciseTypes: ['choice', 'numeric'], load: () => import('./player.mjs')
};
